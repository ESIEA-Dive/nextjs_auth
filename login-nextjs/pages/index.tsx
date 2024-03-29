import { useSession, getSession } from "next-auth/react";
import { Input, Icon, Flex, Button, Text, Heading, InputRightElement, InputGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, useDisclosure, VStack, HStack, Select, Textarea, Card, CardBody, Stack, Divider, CardFooter, ButtonGroup, Wrap, WrapItem, CardHeader, Avatar, Box } from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from '@chakra-ui/icons'
import { GrGroup, GrCalendar } from 'react-icons/gr';
import { FiClock } from 'react-icons/fi';
import { MdOutlineCategory, MdFilterList, MdOutlineCalendarToday } from 'react-icons/md';


// Define Prop Interface
interface ShowProps {
  user: any
  url: string
  courses: any
  coursesJoined: any
}

function Home(props: ShowProps) {
  const { data: session } = useSession();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  const [valueTitle, setValueTitle] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [valueDuration, setValueDuration] = useState("");
  const [valuePrice, setValuePrice] = useState("");
  const [valueDescription, setValueDescription] = useState("");
  const [valuePillar, setValuePillar] = useState("Emotional");
  const [valuePlaces, setValuePlaces] = useState("");

  const [searchField, setSearchField] = useState("");
  const [courses, setCourses] = useState(props.courses);
  const [coursesForSearch, setCoursesForSearch] = useState(props.courses);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [idCourseToDelete, setIdCourseToDelete] = useState("");

  const [coursesJoined, setCoursesJoined] = useState(props.coursesJoined);
  const [coursesJoinedForSearch, setCoursesJoinedForSearch] = useState(props.coursesJoined);
  const [myCoursesSection, setMyCoursesSection] = useState(false);

  const [editCourseMode, setEditCourseMode] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState();

  const updateCourse = async (course: any) => {
    const newCourse = {
      teacherId: session?.user?.id,
      teacherImage: session?.user?.image,
      teacherName: session?.user?.name,
      title: valueTitle,
      date: valueDate,
      duration: valueDuration,
      price: valuePrice,
      description: valueDescription,
      pillar: valuePillar,
      places: valuePlaces,
      participants: course.participants,
    }
    const res = await fetch(props.url + "courses/" + course._id, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
    if (res.status === 200) {
      const res2 = await fetch(props.url + "courses/teacher/" + session?.user?.id, {
        method: "get",
      })
      const newCourses = await res2.json();
      setCourses(newCourses);
      setCoursesForSearch(newCourses);
    }
    cleanEditForm();
  }

  const fillEditForm = (course: any) => {
    setValueTitle(course.title);
    setValueDate(course.date);
    setValueDuration(course.duration);
    setValuePrice(course.price);
    setValueDescription(course.description);
    setValuePillar(course.pillar);
    setValuePlaces(course.places);
    setCourseToEdit(course);
    setEditCourseMode(true);
  }

  const cleanEditForm = () => {
    setValueTitle("");
    setValueDate("");
    setValueDuration("");
    setValuePrice("");
    setValueDescription("");
    setValuePillar("Emotional");
    setValuePlaces("");
    setEditCourseMode(false);
  }

  const createCourse = async () => {
    const newCourse = {
      teacherId: String(session?.user?.id),
      teacherImage: String(session?.user?.image),
      teacherName: String(session?.user?.name),
      title: String(valueTitle),
      date: String(valueDate),
      duration: String(valueDuration),
      price: Number(valuePrice),
      description: String(valueDescription),
      pillar: String(valuePillar),
      places: Number(valuePlaces),
      participants: 0,
    }
    const res = await fetch(props.url + "courses/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
    const result = await res.json();
    if (res.status === 200) {
      const newCourse = [].concat(courses, result);
      setCourses(newCourse);
      setCoursesForSearch(newCourse);
    }
    cleanEditForm();
  }

  const searchForCourses = (value: string) => {
    if (value === "") {
      if (!myCoursesSection) setCourses(coursesForSearch);
      else { setCoursesJoined(coursesJoinedForSearch) };
    }
    else {
      if (!myCoursesSection) {
        const result = coursesForSearch.filter((
          x: { title: string; teacherName: string; description: string; pillar: string }) =>
          x.title.toLowerCase().includes(value.toLowerCase())
          || x.teacherName.toLowerCase().includes(value.toLowerCase())
          || x.description.toLowerCase().includes(value.toLowerCase())
          || x.pillar.toLowerCase().includes(value.toLowerCase())
        );
        setCourses(result);
      }
      else {
        const result = coursesJoinedForSearch.filter((
          x: { title: string; teacherName: string; description: string; pillar: string }) =>
          x.title.toLowerCase().includes(value.toLowerCase())
          || x.teacherName.toLowerCase().includes(value.toLowerCase())
          || x.description.toLowerCase().includes(value.toLowerCase())
          || x.pillar.toLowerCase().includes(value.toLowerCase())
        );
        setCoursesJoined(result);
      }
    }
  }

  const deleteCourse = async (id: string) => {
    const res = await fetch(props.url + "courses/" + id, {
      method: "delete",
    })
    if (res.status === 200) {
      const result = courses.filter((x: { _id: string; }) => !x._id.toLowerCase().includes(id.toLowerCase()));
      setCourses(result);
      setCoursesForSearch(result);
    }
  }

  const joinCourse = async (course: any) => {
    const joinCourse = {
      studentId: session?.user?.id,
      courseId: course._id,
      favorite: false,
    }
    const res = await fetch(props.url + "joincourses/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(joinCourse),
    })
    if (res.status === 200) {
      const OneMorePeopleInCourse = { ...course, participants: course.participants + 1 }
      const res2 = await fetch(props.url + "courses/" + course._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OneMorePeopleInCourse),
      })
      if (res2.status === 200) {
        const res3 = await fetch(props.url + "courses/", {
          method: "get",
        })
        const newCourses = await res3.json();
        setCourses(newCourses);
        setCoursesForSearch(newCourses);

        const res4 = await fetch(props.url + "joincourses/student/" + session?.user?.id, {
          method: "get",
        });
        const listCoursesJoined = await res4.json();
        let tmpCoursesJoined: string[] = [];
        for (let x = 0; x < listCoursesJoined.length; x++) {
          const res = await fetch(props.url + "courses/" + listCoursesJoined[x].courseId, {
            method: "get",
          });
          const result = await res.json();
          tmpCoursesJoined.push(result);
        }
        setCoursesJoined(tmpCoursesJoined);
        setCoursesJoinedForSearch(tmpCoursesJoined);
      }
    }
  }

  const leaveCourse = async (course: any) => {
    const res = await fetch(props.url + "joincourses/" + course._id, {
      method: "delete",
    })
    if (res.status === 200) {
      const OneLessPeopleInCourse = { ...course, participants: course.participants - 1 }
      const res2 = await fetch(props.url + "courses/" + course._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OneLessPeopleInCourse),
      })

      if (res2.status === 200) {
        const res3 = await fetch(props.url + "courses/", {
          method: "get",
        })
        const newCourses = await res3.json();
        setCourses(newCourses);
        setCoursesForSearch(newCourses);

        const res4 = await fetch(props.url + "joincourses/student/" + session?.user?.id, {
          method: "get",
        });
        const listCoursesJoined = await res4.json();
        let tmpCoursesJoined: string[] = [];
        for (let x = 0; x < listCoursesJoined.length; x++) {
          const res = await fetch(props.url + "courses/" + listCoursesJoined[x].courseId, {
            method: "get",
          });
          const result = await res.json();
          tmpCoursesJoined.push(result);
        }
        setCoursesJoined(tmpCoursesJoined);
        setCoursesJoinedForSearch(tmpCoursesJoined);
      }
    }
  }

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {props.user.status === "Teacher" && (<Heading>My Courses</Heading>)}
      {props.user.status === "Student" && (<HStack spacing={20}>
        <Heading
          color={myCoursesSection ? 'lightgrey' : 'black'}
          _hover={{ cursor: 'pointer' }}
          onClick={() => { setMyCoursesSection(false); setSearchField(""); searchForCourses("") }}
        >
          Join Courses
        </Heading>
        <Heading
          color={myCoursesSection ? 'black' : 'lightgrey'}
          _hover={{ cursor: 'pointer' }}
          onClick={() => { setMyCoursesSection(true); setSearchField(""); searchForCourses("") }}
        >
          My Courses
        </Heading>
      </HStack>)}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new course</ModalHeader>
          <VStack alignItems='left' style={{ paddingInline: "40px" }}>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Title</Text>
              <Input onChange={(e: any) => setValueTitle(e.target.value)} value={valueTitle} placeholder="Title" size="sm" />
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Date</Text>
              <Input onChange={(e: any) => setValueDate(e.target.value)} value={valueDate} placeholder="Date and time" size="sm" type="datetime-local" />
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Duration</Text>
              <Input onChange={(e: any) => setValueDuration(e.target.value)} value={valueDuration} placeholder="Duration" size="sm" type="time"></Input>
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Price ($)</Text>
              <Input onChange={(e: any) => setValuePrice(e.target.value)} value={valuePrice} placeholder="Price" size="sm" type="number" />
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Description</Text>
              <Textarea onChange={(e: any) => setValueDescription(e.target.value)} value={valueDescription} placeholder="Description" size="sm" />
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Pillar</Text>
              <Select onChange={(e: any) => setValuePillar(e.target.value)} value={valuePillar} size="sm">
                <option>Emotional</option>
                <option>Physical</option>
                <option>Mental</option>
                <option>Spiritual</option>
                <option>Social</option>
                <option>Environmental</option>
                <option>Financial</option>
                <option>Occupational</option>
              </Select>
            </HStack>
            <HStack>
              <Text width={100} text-align='left' fontSize={15}>Places</Text>
              <Input onChange={(e: any) => setValuePlaces(e.target.value)} value={valuePlaces} placeholder="Places available" size="sm" type="number" />
            </HStack>
          </VStack>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='teal' mr={4} onClick={() => {
              if (editCourseMode) updateCourse(courseToEdit);
              else { createCourse() }
              onCreateClose();
            }}>
              Validate
            </Button>
            <Button variant='ghost' onClick={() => { onCreateClose(); cleanEditForm(); }} >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <HStack mt={5}>
        <InputGroup size='md' width={500}>
          <Input
            pr='4.5rem'
            type='text'
            placeholder='Search for a course'
            value={searchField}
            style={{ border: "1px solid #D3D3D3" }}
            focusBorderColor='#008080'
            onChange={(e: any) => { setSearchField(e.target.value); searchForCourses(e.target.value) }}
          />
          <InputRightElement>
            <Button onClick={() => { searchForCourses(searchField) }} rightIcon={<SearchIcon />} variant='solid' colorScheme='teal' pl={2}></Button>
          </InputRightElement>
        </InputGroup>
        <Button onClick={undefined} rightIcon={
          <Icon
            as={MdFilterList}
            style={{
              height: '24px',
              width: '24px',
            }}
          />
        }
          variant='solid'
          colorScheme='teal'
          pl={2}
        />
        {props.user.status === "Teacher" && (<Button onClick={onCreateOpen} ml={10} colorScheme='teal' size='md'>Add course</Button>)}
      </HStack>
      <Wrap
        spacing='20px'
        justify='center'
        pt={5}
        pb={5}
      >{(props.user.status === 'Teacher' ? courses : myCoursesSection ? coursesJoined : courses).map(
        (course: any, index: number) =>
          <WrapItem key={index}>
            <Card height={350} width={350} style={{ border: "1px solid #D3D3D3", backgroundColor: '#f3f5f5' }}>
              <CardHeader>
                <Flex justifyContent="space-between">
                  <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    <Avatar name={course.teacherName} src={course.teacherImage} />
                    <Box>
                      <Heading size='sm' maxWidth={170} noOfLines={1}>{course.teacherName}</Heading>
                      <Text maxWidth={170} noOfLines={1}>{course.title}</Text>
                    </Box>
                  </Flex>
                  <Flex mt={3}>
                    <Text fontSize={14} fontWeight={600} mr={2}>
                      {course.participants}/{course.places}
                    </Text>
                    <Icon
                      as={GrGroup}
                      style={{
                        height: '24px',
                        width: '24px',
                      }}
                    />
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody mt={-10}>
                <Stack spacing='5' p={4} >
                  <Text noOfLines={4}>
                    {course.description}
                  </Text>
                  <HStack justifyContent='space-between'>
                    <VStack spacing={0}>
                      <Icon
                        as={MdOutlineCalendarToday}
                        style={{
                          height: '24px',
                          width: '24px',
                        }}
                      />
                      <Text fontSize={12}>
                        {course.date.split('T')[0]}
                      </Text>
                      <Text fontSize={12} fontWeight={600} mt={-4}>
                        {course.date.split('T')[1].split(':')[0]}H{course.date.split('T')[1].split(':')[1]}
                      </Text>
                    </VStack>
                    <VStack>
                      <Icon
                        as={FiClock}
                        style={{
                          height: '24px',
                          width: '24px',
                        }}
                      />
                      <Text fontSize={12}>
                        {course.duration.split(':')[0]}H{course.duration.split(':')[1]}
                      </Text>
                    </VStack>
                    <VStack>
                      <Icon
                        as={MdOutlineCategory}
                        style={{
                          height: '24px',
                          width: '24px',
                        }}
                      />
                      <Text fontSize={12}>
                        {course.pillar}
                      </Text>
                    </VStack>
                  </HStack>
                </Stack>
                <Divider borderWidth={1} />
              </CardBody>
              <CardFooter mt={-8}>
                <Flex style={{ width: "100%" }} justifyContent={"space-between"}>
                  {props.user.status === "Teacher" && (<ButtonGroup spacing=''>
                    <Button onClick={() => { fillEditForm(course); onCreateOpen() }} variant='solid' colorScheme='teal'>
                      Edit
                    </Button>
                    <Button variant='ghost' colorScheme='red' onClick={() => { setIdCourseToDelete(course._id); onDeleteOpen() }}>
                      Delete
                    </Button>
                  </ButtonGroup>)}
                  {props.user.status === "Student" && (<ButtonGroup spacing=''>
                    {(!myCoursesSection && (coursesJoined.some((x: { _id: string; }) => x._id === course._id)) === false) && (<Button variant='solid' colorScheme='teal' onClick={() => { joinCourse(course) }}>
                      Join
                    </Button>)}
                    {(!myCoursesSection && (coursesJoined.some((x: { _id: string; }) => x._id === course._id)) === true) && (<Button variant='solid' colorScheme='red' onClick={() => { leaveCourse(course) }}>
                      Leave
                    </Button>)}
                    {myCoursesSection && (<Button variant='solid' colorScheme='red' onClick={() => { leaveCourse(course) }}>
                      Leave
                    </Button>)}
                  </ButtonGroup>)}
                  <Text color='black' fontSize='20' style={{ border: "1px solid black", borderRadius: "10px", padding: "5px 15px" }}>
                    ${course.price}
                  </Text>
                </Flex>
              </CardFooter>
            </Card>
          </WrapItem>)}
      </Wrap>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete this course ?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='teal' mr={4} onClick={() => { deleteCourse(idCourseToDelete); onDeleteClose(); }}>
              Yes
            </Button>
            <Button variant='ghost' onClick={onDeleteClose} >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (session?.user) {
    const resultUsers = await fetch(process.env.API_URL + "users/" + session?.user?.id);
    const user = await resultUsers.json();
    if (!user.filledForm) {
      return {
        redirect: {
          permanent: false,
          destination: "/form",
        },
        props: {},
      }
    }
    else {
      if (user.status === "Teacher") {
        const resultCourses = await fetch(process.env.API_URL + "courses/teacher/" + session?.user?.id, {
          method: "get",
        });
        const courses = await resultCourses.json();
        return {
          props: {
            user: user,
            url: process.env.API_URL,
            courses: courses,
          }
        }
      }
      else {
        const resultCourses = await fetch(process.env.API_URL + "courses/", {
          method: "get",
        });
        const courses = await resultCourses.json();
        const resultCoursesJoined = await fetch(process.env.API_URL + "joincourses/student/" + session?.user?.id, {
          method: "get",
        });
        const listCoursesJoined = await resultCoursesJoined.json();
        let coursesJoined: string[] = [];
        for (let x = 0; x < listCoursesJoined.length; x++) {
          const res = await fetch(process.env.API_URL + "courses/" + listCoursesJoined[x].courseId, {
            method: "get",
          });
          const result = await res.json();
          coursesJoined.push(result);
        }
        return {
          props: {
            user: user,
            url: process.env.API_URL,
            courses: courses,
            coursesJoined: coursesJoined,
          }
        }
      }
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/auth",
    },
    props: {},
  }
}
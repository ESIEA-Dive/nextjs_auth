import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../../../../lib/dbConnect"
import { ResponseFuncs } from "../../../../lib/types"
import Course from "../../../../model/Course";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      return res.json(await Course.find({teacherId: id}).catch(catcher))
    },
    // RESPONSE PUT REQUESTS
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      return res.json(await Course.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher))
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      return res.json(await Course.findByIdAndRemove(id).catch(catcher))
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler
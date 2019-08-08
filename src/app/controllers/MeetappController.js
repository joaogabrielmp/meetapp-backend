import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetapp from '../models/Meetapp';

class MeetappController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const user_id = req.userId;

    const { id, title, description, location } = await Meetapp.create(
      ...req.body,
      user_id
    );

    return res.json({ id, title, description, location, date, user_id });
  }
}

export default new MeetappController();

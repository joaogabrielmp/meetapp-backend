import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, parse, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    try {
      const page = req.params.page || 1;
      const where = {};

      if (req.params.date) {
        const date = parse(req.params.date);
        where.date = {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        };
      }

      const meetups = await Meetup.findAll({
        where,
        include: [User],
        limit: 10,
        offset: 10 * page - 10,
      });

      if (!meetups) {
        return res.status(400).json({ error: 'Meetup not found' });
      }

      return res.json(meetups);
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'An unexpected error has occurred. Try again' });
    }
  }

  async store(req, res) {
    try {
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
        return res.status(400).json({
          error: 'Meetup date must be equal to or greater current date',
        });
      }

      const user_id = req.userId;

      const { id, title, description, location } = await Meetup.create({
        ...req.body,
        user_id,
      });

      return res.json({ id, title, description, location, date, user_id });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'An unexpected error has occurred. Try again' });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        location: Yup.string(),
        date: Yup.date(),
        file_id: Yup.number(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const { id } = req.params;
      const { date } = req.body;

      const meetup = await Meetup.findByPk(id);

      if (!meetup) {
        return res.status(400).json({ error: 'Meetup not found' });
      }

      if (meetup.user_id !== req.userId) {
        return res.status(400).json({ error: 'User must be meetup organizer' });
      }

      if (isBefore(parseISO(date), new Date())) {
        return res.status(400).json({
          error: 'Meetup date must be equal to or greater current date',
        });
      }

      if (meetup.past) {
        return res.status(400).json({ error: 'Meetup already ended.' });
      }

      await meetup.update(req.body);

      return res.json(meetup);
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'An unexpected error has occurred. Try again' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const meetup = await Meetup.findByPk(id);

      if (!meetup) {
        return res.status(400).json({ error: 'Meetup not found' });
      }

      if (meetup.user_id !== req.userId) {
        return res.status(400).json({ error: 'User must be meetup organizer' });
      }

      if (meetup.past) {
        return res.status(400).json({ error: 'Meetup already ended.' });
      }

      await meetup.destroy();

      return res.json({ message: 'Meetup canceled' });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'An unexpected error has occurred. Try again' });
    }
  }
}

export default new MeetupController();

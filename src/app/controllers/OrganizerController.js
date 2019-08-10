import Meetup from '../models/Meetup';

class OrganizerController {
  async index(req, res) {
    try {
      const user_id = req.userId;

      const meetups = await Meetup.findAll({ where: { user_id } });

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
}

export default new OrganizerController();

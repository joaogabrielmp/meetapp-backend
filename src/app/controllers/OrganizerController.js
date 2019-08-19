import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizerController {
  async index(req, res) {
    const user_id = req.userId;

    const meetups = await Meetup.findAll({
      where: { user_id },
      include: [{ model: File, attributes: ['id', 'path', 'url'] }],
      order: [['date', 'ASC']],
    });

    if (!meetups) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    return res.json(meetups);
  }
}

export default new OrganizerController();

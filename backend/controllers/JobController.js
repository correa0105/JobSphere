import { Op, where, fn, col, literal } from 'sequelize';

import Job from '../models/Job';

import getToken from '../helpers/getToken';
import getUserByToken from '../helpers/getUserByToken';

class JobController {
  async store(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { numberOfHours, valuePerHour, dayWeek, initialDate, finalDate, specificDate, location, employer } =
      req.body;

    if (
      !numberOfHours ||
      !valuePerHour ||
      (!dayWeek && !specificDate) ||
      (!initialDate && !finalDate && !specificDate)
    ) {
      return res.status(400).json({
        mensagem: 'Incomplete or invalid data!',
      });
    }

    const worksCreate = [];

    if (specificDate) {
      worksCreate.push({
        location,
        employer,
        numberOfHours,
        valuePerHour,
        workDate: new Date(specificDate),
        user_id: user.dataValues.id,
      });
    } else {
      const start = new Date(initialDate);
      const end = new Date(finalDate);

      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dayOfWeek = day.getUTCDay();
        if (dayWeek.includes(dayOfWeek)) {
          worksCreate.push({
            location,
            employer,
            numberOfHours,
            valuePerHour,
            workDate: new Date(day.toISOString().split('T')[0]),
            user_id: user.dataValues.id,
          });
        }
      }
    }

    try {
      const jobs = await Job.bulkCreate(worksCreate, { returning: true });

      return res.status(201).json({
        message: 'Jobs registered successfully!',
        jobs: jobs.map((job) => ({
          id: job.id,
          numberOfHours: job.numberOfHours,
          valuePerHour: job.valuePerHour,
          workDate: job.workDate,
          user_id: job.user_id,
        })),
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Jobs registered successfully!'],
      });
    }
  }

  async show(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        mensagem: "The 'jobId' parameter is mandatory to search for the job.",
      });
    }

    try {
      const job = await Job.findOne({
        where: {
          id: jobId,
          user_id: user.dataValues.id,
        },
      });

      if (!job) {
        return res.status(404).json({
          mensagem: 'Work not found or does not belong to the user.',
        });
      }

      return res.status(200).json({
        mensagem: 'Job successfully found!',
        job,
      });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Error when searching for work'],
      });
    }
  }

  async index(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    try {
      const jobs = await Job.findAll({
        attributes: [
          'employer',
          [fn('SUM', col('number_of_hours')), 'totalHours'],
          [fn('SUM', literal('number_of_hours * value_per_hour')), 'totalPayment'],
        ],
        where: {
          user_id: user.dataValues.id,
          workDate: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: ['employer'],
      });

      const totalHoursAll = jobs.reduce((sum, job) => sum + Number(job.dataValues.totalHours), 0);
      const totalPaymentAll = jobs.reduce((sum, job) => sum + Number(job.dataValues.totalPayment), 0);

      return res.status(200).json({
        message: 'Trabalhos obtidos com sucesso!',
        jobs: jobs.map((job) => ({
          employer: job.employer,
          totalHours: job.dataValues.totalHours,
          totalPayment: job.dataValues.totalPayment,
        })),
        totalHoursAll,
        totalPaymentAll,
      });
    } catch (error) {
      return res.status(400).json({
        errors: ['Error getting jobs'],
      });
    }
  }

  async update(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const jobId = req.params.id;
    const { numberOfHours, valuePerHour, workDate, location, employer } = req.body;

    if (!jobId) {
      return res.status(400).json({
        mensagem: "The 'jobId' parameter is mandatory to update the job.",
      });
    }

    try {
      const job = await Job.findOne({
        where: {
          id: jobId,
          user_id: user.dataValues.id,
        },
      });

      if (!job) {
        return res.status(404).json({
          mensagem: 'Work not found or does not belong to the user.',
        });
      }

      await job.update({
        numberOfHours: numberOfHours || job.numberOfHours,
        valuePerHour: valuePerHour || job.valuePerHour,
        workDate: workDate ? new Date(workDate) : job.workDate,
        location: location || job.location,
        employer: employer || job.employer,
      });

      return res.status(200).json({
        mensagem: 'Trabalho atualizado com sucesso!',
        job,
      });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Erro ao atualizar o trabalho'],
      });
    }
  }

  async delete(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        mensagem: "The 'jobId' parameter is mandatory to delete the job.",
      });
    }

    try {
      const job = await Job.findOne({
        where: {
          id: jobId,
          user_id: user.dataValues.id,
        },
      });

      if (!job) {
        return res.status(404).json({
          mensagem: 'Work not found or does not belong to the user.',
        });
      }

      await job.destroy();

      return res.status(200).json({
        mensagem: 'Work deleted successfully!',
      });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Error when deleting work'],
      });
    }
  }

  async getJobsTodayOrTomorrow(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { dateType } = req.query;

    if (!['today', 'tomorrow'].includes(dateType)) {
      return res.status(400).json({
        mensagem: "The 'dateType' parameter must be 'today' or 'tomorrow'.",
      });
    }

    const today = new Date();
    let startDate;
    let endDate;

    if (dateType === 'today') {
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (dateType === 'tomorrow') {
      startDate = new Date(today.setDate(today.getDate() + 1));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    }

    try {
      const jobs = await Job.findAll({
        where: {
          user_id: user.dataValues.id,
          workDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      if (jobs.length === 0) {
        return res.status(404).json({
          mensagem: `No jobs found for ${dateType}.`,
        });
      }

      return res.status(200).json({
        mensagem: `Works from ${dateType} successfully recovered!`,
        jobs,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Error when searching for jobs'],
      });
    }
  }

  async totalHours(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        mensagem: 'Month and year are required!',
      });
    }

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    try {
      const jobs = await Job.findAll({
        where: {
          user_id: user.dataValues.id,
          workDate: {
            [Op.and]: [
              where(fn('MONTH', col('work_date')), monthInt),
              where(fn('YEAR', col('work_date')), yearInt),
            ],
          },
        },
      });

      if (jobs.length === 0) {
        return res.status(404).json({
          mensagem: 'No jobs found for the specified user and month.',
        });
      }

      const totalHours = jobs.reduce((sum, job) => sum + job.numberOfHours, 0);
      const totalAmount = jobs.reduce((sum, job) => sum + job.numberOfHours * job.valuePerHour, 0);

      return res.status(200).json({
        mensagem: 'Report of hours and total value calculated successfully!',
        totalHours,
        totalAmount,
        month: `${month}/${year}`,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Error when searching for jobs'],
      });
    }
  }

  async totalHoursPerEmployer(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { employer, month, year } = req.query;

    if (!employer || !month || !year) {
      return res.status(400).json({
        mensagem: 'Employer, month and year are required!',
      });
    }

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    try {
      const jobs = await Job.findAll({
        where: {
          user_id: user.dataValues.id,
          employer,
          workDate: {
            [Op.and]: [
              where(fn('MONTH', col('work_date')), monthInt),
              where(fn('YEAR', col('work_date')), yearInt),
            ],
          },
        },
      });

      if (jobs.length === 0) {
        return res.status(404).json({
          mensagem: 'No jobs found for the specified employer and month.',
        });
      }

      const totalHours = jobs.reduce((sum, job) => sum + job.numberOfHours, 0);
      const totalAmount = jobs.reduce((sum, job) => sum + job.numberOfHours * job.valuePerHour, 0);

      return res.status(200).json({
        mensagem: 'Report of hours and total value calculated successfully!',
        totalHours,
        totalAmount,
        month: `${month}/${year}`,
        employer,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors ? e.errors.map((err) => err.message) : ['Error when searching for jobs'],
      });
    }
  }

  async totalPerLocation(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        mensagem: 'Month and year are required!',
      });
    }

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    try {
      const jobs = await Job.findAll({
        attributes: [
          'location',
          'value_per_hour',
          [fn('SUM', col('number_of_hours')), 'totalHours'],
          [fn('SUM', literal('number_of_hours * value_per_hour')), 'totalPayment'],
          [fn('COUNT', col('location')), 'locationCount'],
        ],
        where: {
          user_id: user.dataValues.id,
          workDate: {
            [Op.and]: [
              where(fn('MONTH', col('work_date')), monthInt),
              where(fn('YEAR', col('work_date')), yearInt),
            ],
          },
        },
        group: ['location', 'value_per_hour'],
      });

      const totalHoursAll = jobs.reduce((sum, job) => sum + Number(job.dataValues.totalHours), 0);
      const totalPaymentAll = jobs.reduce((sum, job) => sum + Number(job.dataValues.totalPayment), 0);

      return res.status(200).json({
        message: 'Report by location successfully obtained!',
        jobs: jobs.map((job) => ({
          location: job.location,
          valuePerHour: job.dataValues.value_per_hour,
          totalHours: job.dataValues.totalHours,
          totalPayment: job.dataValues.totalPayment,
          locationCount: job.dataValues.locationCount,
        })),
        totalHoursAll,
        totalPaymentAll,
      });
    } catch (error) {
      return res.status(400).json({
        errors: ['Error getting report by location'],
      });
    }
  }

  async jobsByDate(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { date } = req.query;

    try {
      if (!date) {
        return res.status(400).json({ errors: ['The date is mandatory for the filter.'] });
      }

      const jobs = await Job.findAll({
        where: {
          user_id: user.dataValues.id,
          workDate: {
            [Op.eq]: new Date(date),
          },
        },
        attributes: ['id', 'location', 'number_of_hours', 'value_per_hour', 'workDate'],
        order: [['workDate', 'ASC']],
      });

      return res.status(200).json({
        message: 'Jobs filtered by date successfully obtained!',
        jobs,
      });
    } catch (error) {
      return res.status(400).json({
        errors: ['Error when obtaining jobs filtered by date'],
      });
    }
  }
}

export default new JobController();

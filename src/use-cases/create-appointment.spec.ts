import { describe, expect, it } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../entities/appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { InMemoryAppointmentRepository } from '../repositories/in-memory/in-memory-appointment-repository'

describe('Create Appointment', () => {
	it('should be able to create an appointment', () => {
		const appointmentsRepository = new InMemoryAppointmentRepository()
		const createAppointment = new CreateAppointment(appointmentsRepository)

		const startsAt = getFutureDate('2023-12-21')
		const endsAt = getFutureDate('2023-12-22')

		expect(
			createAppointment.execute({
				customer: 'John Doe',
				startsAt,
				endsAt,
			})
		).resolves.toBeInstanceOf(Appointment)
	})
	it('should not be able to create an appointment with overlapping', async () => {
		const appointmentsRepository = new InMemoryAppointmentRepository()
		const createAppointment = new CreateAppointment(appointmentsRepository)

		const startsAt = getFutureDate('2023-12-21')
		const endsAt = getFutureDate('2023-12-23')

		await createAppointment.execute({
			customer: 'John Doe',
			startsAt,
			endsAt,
		})

		expect(
			createAppointment.execute({
				customer: 'John Doe',
				startsAt: getFutureDate('2023-12-22'),
				endsAt: getFutureDate('2023-12-25'),
			})
		).rejects.toBeInstanceOf(Error)

		expect(
			createAppointment.execute({
				customer: 'John Doe',
				startsAt: getFutureDate('2023-12-20'),
				endsAt: getFutureDate('2023-12-22'),
			})
		).rejects.toBeInstanceOf(Error)

		expect(
			createAppointment.execute({
				customer: 'John Doe',
				startsAt: getFutureDate('2023-12-20'),
				endsAt: getFutureDate('2023-12-26'),
			})
		).rejects.toBeInstanceOf(Error)

		expect(
			createAppointment.execute({
				customer: 'John Doe',
				startsAt: getFutureDate('2023-12-23'),
				endsAt: getFutureDate('2023-12-24'),
			})
		).rejects.toBeInstanceOf(Error)
	})
})

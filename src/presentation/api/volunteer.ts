import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerError } from '@src/domain/errors/volunteer';
import {
  Body,
  Controller,
  Delete,
  FieldErrors,
  Get,
  Patch,
  Path,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags
} from 'tsoa';
import { inject } from 'inversify';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { provide } from 'inversify-binding-decorators';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer/volunteer-auth-entity';
import { ApiError } from '../types/api-error';

@Route('volunteers')
@Response<{ message: string; details: FieldErrors }>(422, 'Validation Error')
@Security('jwt')
@provide(VolunteerAPI)
@Tags('Volunteer')
export class VolunteerAPI extends Controller {
  private volunteerRepository: VolunteerRepository;

  constructor(
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository
  ) {
    super();
    this.volunteerRepository = volunteerRepository;
  }

  /**
   * Create the volunteer password if it does not exist or udpdate it.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Patch('{email}/password')
  @SuccessResponse(204, 'Password Successfully created or updated')
  @Response<VolunteerError>(400, 'Could not find volunteer')
  async createOrUpdatePassword(
    @Path() email: string,
    @Body() passwordWrapper: Pick<VolunteerAuthDataEntity, 'password'>
  ): Promise<void> {
    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        passwordWrapper.password
      );

    if (!success) {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message:
            'Could not create or update volunteer password because it was not found'
        })
      );
    }
  }

  /**
   * Update the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Put('{email}')
  @SuccessResponse(200, 'Volunteer successfully updated')
  @Response<VolunteerError>(400, 'Could not update volunteer', {
    name: 'VOLUNTEER_NOT_UPDATED',
    message: 'Volunteer with email {some email} not updated'
  })
  async updateVolunteer(
    @Path() email: string,
    @Body() volunteer: UpdateVolunteerEntity
  ): Promise<VolunteerEntity> {
    const updatedVolunteer = await this.volunteerRepository.updateVolunteer(
      volunteer,
      email
    );

    if (!updatedVolunteer) {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_UPDATED',
          message: `Volunteer with email ${email} not updated`
        })
      );
    }

    return updatedVolunteer;
  }

  /**
   * Get the volunteer by email.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Get('{email}')
  @SuccessResponse(200, 'Get volunteer by specified email')
  @Response<VolunteerError>(400, 'Could not find volunteer')
  async getVolunteerByEmail(@Path() email: string): Promise<VolunteerEntity> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    if (!volunteer)
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${email} not found`
        })
      );

    return volunteer;
  }

  /**
   * Delete the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Delete('{email}')
  @SuccessResponse(204, 'Successfully deleted volunteer')
  @Response<VolunteerError>(400, 'Could not delete volunteer', {
    name: 'VOLUNTEER_NOT_DELETED',
    message: 'Volunteer with email {some email} not deleted'
  })
  async deleteVolunteer(@Path() email: string): Promise<void> {
    const volunteerIsDeleted =
      await this.volunteerRepository.deleteVolunteerByEmail(email);

    if (!volunteerIsDeleted)
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_DELETED',
          message: `Volunteer with email ${email} not deleted`
        })
      );
  }
}

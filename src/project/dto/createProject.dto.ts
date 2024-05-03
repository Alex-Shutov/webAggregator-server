import { PROJECT_STATUSES } from '@app/project/constants/project.constants';

export class CreateProjectDto {
  name:string
  description: string;
  howToPlay: string;
  gitLink: string;
  eventId:string
  status:PROJECT_STATUSES.CHECK

}

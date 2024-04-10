import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';

describe('Project', () => {
  let provider: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
    }).compile();

    provider = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

import { CreateAuthorDTO } from '../dto/create-author.dto';
import { Authors } from '../entity/author.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author.service';
import { validate } from 'class-validator';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

const mockAuthorRepository = {
};

describe('AuthorService', () => {
    let service: AuthorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CloudinaryModule
            ],
            providers: [
                AuthorService,
                { provide: 'AuthorsRepository', useValue: mockAuthorRepository },
            ],
        }).compile();

        service = module.get<AuthorService>(AuthorService);
    });


    describe('Validating DTO', () => {
        it('should pass validation with a valid name', async () => {
            const data = new CreateAuthorDTO();
            data.name = 'Robson';

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with an empty name', async () => {
            const data = new CreateAuthorDTO();
            data.name = '';

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    })

});
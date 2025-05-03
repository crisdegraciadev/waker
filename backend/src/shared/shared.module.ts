import { Global, Module } from "@nestjs/common";
import { PaginationService } from "./pagination.service";
import { DatabaseService } from "./database.service";

@Global()
@Module({
  providers: [PaginationService, DatabaseService],
  exports: [PaginationService, DatabaseService],
})
export class SharedModule { }

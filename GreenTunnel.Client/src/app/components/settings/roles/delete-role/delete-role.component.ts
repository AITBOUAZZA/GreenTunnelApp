import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/models/role.model';
import { AccountService } from 'src/app/services/account.service';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-delete-role',
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss']
})
export class DeleteRoleComponent {
  @Input() row: Role;
  @Output() deleteChanged: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private accountService: AccountService,

  ) { }

  ngOnInit(): void {

  }
  confirm() {
    this.deleteUserHelper(this.row);
  }
  decline() {
    this.activeModal.close();
  }
  deleteUserHelper(row: Role) {
    this.toastr.success('Deleting...');
    // this.loadingIndicator = true;

    this.accountService.deleteRole(row).subscribe({
      next: (_) => {
        //  this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.toastr.success('Delete Role', `Role ${row.name} has been deleted successfully.`);
        this.deleteChanged.emit(true);
      },
      error: (error) => {
        // this.alertService.stopLoadingMessage();
        // this.loadingIndicator = false;

        this.toastr.error(
          'Delete Error',
          `An error occurred whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(
            error
          )}"`
        );
      },
    });
  }
}

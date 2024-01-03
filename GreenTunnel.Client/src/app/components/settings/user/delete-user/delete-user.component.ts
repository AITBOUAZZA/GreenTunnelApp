import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
  @Input() row: User;
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
  deleteUserHelper(row: User) {
    this.toastr.success('Deleting...');
    // this.loadingIndicator = true;

    this.accountService.deleteUser(row).subscribe({
      next: (_) => {
        //  this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.toastr.success('Delete User', `User ${row.fullName} has been deleted successfully.`);
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

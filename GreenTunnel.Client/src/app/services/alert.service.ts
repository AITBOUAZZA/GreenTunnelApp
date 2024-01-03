 

// tslint:disable:no-console
import { Injectable } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Utilities } from './utilities';

@Injectable()
export class AlertService {
  private messages = new Subject<AlertCommand>();
  private dialogs = new Subject<AlertDialog>();

  private loadingMessageTimeoutId: any;



  showDialog(message: string):any;
  showDialog(message: string, type: DialogType, okCallback: (val?: any) => any):any;
  showDialog(message: string, type: DialogType, okCallback?: ((val?: any) => any) | any, cancelCallback?: (() => any) | any, okLabel?: string | any, cancelLabel?: string | any, defaultValue?: string | any):any;
  showDialog(message: string, type?: DialogType, okCallback?: ((val?: any)  => any) | any  , cancelCallback?: (() => any) | any, okLabel?: string | any, cancelLabel?: string | any, defaultValue?: string | any):any {

    if (!type) {
      type = DialogType.alert;
    }

    this.dialogs.next({ message, type, okCallback, cancelCallback, okLabel, cancelLabel, defaultValue });
  }

  showMessage(summary: string):any;
  showMessage(summary: string, detail: string, severity: MessageSeverity):any;
  showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity):any;
  showMessage(response: HttpResponseBase, ignoreValueUseNull: string, severity: MessageSeverity):any;
  showMessage(data: any, separatorOrDetail?: string | any, severity?: MessageSeverity):any {
    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail);

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
      }
    } else {
      this.showMessageHelper(data, separatorOrDetail, severity, false);
    }
  }

  showStickyMessage(summary: string):any;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any):any;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any, onRemove?: () => any):any;
  showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity):any;
  showStickyMessage(response: HttpResponseBase, ignoreValueUseNull: string, severity: MessageSeverity):any;
  showStickyMessage(data: string | string[] | HttpResponseBase, separatorOrDetail?: string | any, severity?: MessageSeverity, error?: any, onRemove?: () => any):any {

    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail);

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
      }
    } else {
      if (error) {
        const msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${Utilities.safeStringify(error)}"`;

        switch (severity) {
          case MessageSeverity.default:
            this.logInfo(msg);
            break;
          case MessageSeverity.info:
            this.logInfo(msg);
            break;
          case MessageSeverity.success:
            this.logMessage(msg);
            break;
          case MessageSeverity.error:
            this.logError(msg);
            break;
          case MessageSeverity.warn:
            this.logWarning(msg);
            break;
          case MessageSeverity.wait:
            this.logTrace(msg);
            break;
        }
      }

      this.showMessageHelper(data, separatorOrDetail, severity, true, onRemove);
    }
  }

  private showMessageHelper(summary: string, detail: string, severity: MessageSeverity, isSticky: boolean, onRemove?: () => any) {

    const alertCommand: AlertCommand = {
      operation: isSticky ? 'add_sticky' : 'add',
      message: { severity, summary, detail },
      onRemove
    };

    this.messages.next(alertCommand);
  }

  resetStickyMessage() {
    this.messages.next({ operation: 'clear' });
  }

  startLoadingMessage(message = 'Loading...', caption = '') {
    clearTimeout(this.loadingMessageTimeoutId);

    this.loadingMessageTimeoutId = setTimeout(() => {
      this.showStickyMessage(caption, message, MessageSeverity.wait);
    }, 1000);
  }

  stopLoadingMessage() {
    clearTimeout(this.loadingMessageTimeoutId);
    this.resetStickyMessage();
  }



  logDebug(msg:any) {
    console.debug(msg);
  }

  logError(msg:any) {
    console.error(msg);
  }

  logInfo(msg:any) {
    console.info(msg);
  }

  logMessage(msg:any) {
    console.log(msg);
  }

  logTrace(msg:any) {
    console.trace(msg);
  }

  logWarning(msg:any) {
    console.warn(msg);
  }

  getDialogEvent(): Observable<AlertDialog> {
    return this.dialogs.asObservable();
  }

  getMessageEvent(): Observable<AlertCommand> {
    return this.messages.asObservable();
  }
}


// ******************** Dialog ********************//
export class AlertDialog {
  constructor(
    public message: string,
    public type: DialogType,
    public okCallback: (val?: any) => any,
    public cancelCallback: () => any,
    public defaultValue: string,
    public okLabel: string,
    public cancelLabel: string) {

  }
}

export enum DialogType {
  alert,
  confirm,
  prompt
}
// ******************** End ********************//


// ******************** Growls ********************//
export class AlertCommand {
  constructor(
    public operation: 'clear' | 'add' | 'add_sticky',
    public message?: AlertMessage,
    public onRemove?: () => any) { }
}

export class AlertMessage {
  constructor(
    public severity: MessageSeverity,
    public summary: string,
    public detail: string) { }
}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait
}
// ******************** End ********************//

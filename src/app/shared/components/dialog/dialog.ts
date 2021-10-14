import { EventEmitter, Output, Directive } from "@angular/core";

export interface DialogData {
  primaryButtonLabel?: string;
  primaryButtonLabelWhenBusy?: string;
  closingManually?: boolean;
  closeButtonLabel?: string;
}

@Directive()
export abstract class Dialog {

  @Output() done = new EventEmitter<any>();
  private originalPrimaryButtonLabel: string;
  private currentPrimaryButtonLabel: string;
  primaryButtonLabelWhenBusy: string;
  isBusy: boolean = false;
  closingManually: boolean;
  closeButtonLabel?: string;

  get primaryButtonLabel(): string { return this.currentPrimaryButtonLabel }

  constructor(private _data: DialogData, private _dialogRef) {
    this.originalPrimaryButtonLabel = this._data.primaryButtonLabel || 'Ok';
    this.primaryButtonLabelWhenBusy = this._data.primaryButtonLabelWhenBusy;
    this.currentPrimaryButtonLabel = this.originalPrimaryButtonLabel;
    this.closingManually = this._data.closingManually;
    this.closeButtonLabel = this._data.closeButtonLabel || 'Close';
  }

  setBusy() {
    this.isBusy = true;
    if (this.primaryButtonLabelWhenBusy) {
      console.warn('setting busy');
      console.warn(this.primaryButtonLabelWhenBusy);
      this.currentPrimaryButtonLabel = this.primaryButtonLabelWhenBusy;
    }
  }

  setIdle() {
    this.isBusy = false;
    this.currentPrimaryButtonLabel = this.originalPrimaryButtonLabel;
  }

  setIdleWithPrimaryButtonLabel(label: string) {
    this.originalPrimaryButtonLabel = label;
    this.isBusy = false;
    this.currentPrimaryButtonLabel = this.originalPrimaryButtonLabel;
  }

  submit(value: any) {
    this.done.emit(value);
    if (!this.closingManually) {
      this._dialogRef.close(value);
    }
  }

}

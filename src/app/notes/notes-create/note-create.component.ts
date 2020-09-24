import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { NotesService } from './../notes.service';
import { Note } from '../note.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-notes-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.css'],
  providers: [DatePipe]
})
export class NoteCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  note: Note;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private noteId: string;
  todayDate = new Date();

  constructor(
    public notesService: NotesService,
    public route: ActivatedRoute,
    private datePipe: DatePipe
    ) {}


  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.form = new FormGroup({
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('noteId')) {
        this.mode = 'edit';
        this.noteId = paramMap.get('noteId');
        this.isLoading = true;
        this.notesService.getNote(this.noteId).subscribe(noteData => {
          this.isLoading = false;
          this.note = {
            id: noteData._id,
            title: noteData.title,
            content: noteData.content,
            creator: noteData.creator
          };
          this.form.setValue({
            // title: this.datePipe.transform(this.todayDate, 'dd-MM-yyyy'),
            content: this.note.content
          });
        });
      } else {
        this.mode = 'create';
        this.noteId = null;
      }
    });
  }

  // tslint:disable-next-line: typedef
  onSaveNote() {
    if (this.form.invalid) {
      console.log('sono su invalid form');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.notesService.addNote(
        // this.form.value.title,
        this.datePipe.transform(this.todayDate, 'dd-MM-yyyy'),
        this.form.value.content
        );
    } else {
      this.notesService.updateNote(
        this.noteId,
        // this.form.value.title,
        this.datePipe.transform(this.todayDate, 'dd-MM-yyyy'),
        this.form.value.content
        );
    }
  }
}

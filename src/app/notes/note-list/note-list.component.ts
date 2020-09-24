import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Note } from '../note.model';
import { NotesService } from '../notes.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private notesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public notesService: NotesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.notesService.getNotes();
    this.userId = this.authService.getUserId();
    this.notesSub = this.notesService.getNoteUpdateListener()
    .subscribe((notes: Note[]) => {
      this.isLoading = false;
      this.notes = notes;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  // tslint:disable-next-line: typedef
  onDelete(noteId: string) {
    this.notesService.deleteNote(noteId);
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this.notesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}

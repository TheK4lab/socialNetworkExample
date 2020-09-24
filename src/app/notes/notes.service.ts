import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Note } from './note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
    private notes: Note [] = [];
    private notesUpdated = new Subject<Note[]>();

    constructor(private http: HttpClient, private router: Router) {}

    // tslint:disable-next-line: typedef
    getNotes() {
        this.http
        .get<{ message: string, notes: any }>(
            'http://localhost:3000/api/notes'
        )
        .pipe(map((noteData) => {
            return noteData.notes.map(note => {
                return {
                    title: note.title,
                    content: note.content,
                    id: note._id,
                    creator: note.creator
                };
            });
        }))
        .subscribe((transformedNotes) => {
            this.notes = transformedNotes;
            this.notesUpdated.next([...this.notes]);
        });
    }

    // tslint:disable-next-line: typedef
    getNoteUpdateListener() {
        return this.notesUpdated.asObservable();
    }


    // tslint:disable-next-line: typedef
    getNote(id: string) {
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            creator: string
        }>('http://localhost:3000/api/notes/' + id);
    }

    // tslint:disable-next-line: typedef
    addNote(title: string, content: string) {
        const noteData = new FormData();
        noteData.append('title', title),
        noteData.append('content', content),
        this.http.post<{ message: string, note: Note }>('http://localhost:3000/api/notes', noteData)
        .subscribe(responseData => {
            const note: Note = {
                id: responseData.note.id,
                title,
                content,
                creator: null
            };
            this.notes.push(note);
            this.notesUpdated.next([...this.notes]);
            this.router.navigate(['/notes']);
        });
    }

    // tslint:disable-next-line: typedef
    updateNote(id: string, title: string, content: string) {
        let noteData: Note | FormData;
        noteData = {
            id,
            title,
            content,
            creator: null
        };

        this.http.put('http://localhost:3000/api/notes/' + id, noteData)
        .subscribe(response => {
            const updatedNotes = [...this.notes];
            const oldNoteIndex = updatedNotes.findIndex(n => n.id === id);
            const note: Note = {
                id,
                title,
                content,
                creator: null
            };
            updatedNotes[oldNoteIndex] = note;
            this.notes = updatedNotes;
            this.notesUpdated.next([...this.notes]);
            this.router.navigate(['/notes']);
        });
    }

    // tslint:disable-next-line: typedef
    deleteNote(noteId: string) {
        this.http.delete('http://localhost:3000/api/notes/' + noteId)
        .subscribe(() => {
            const updatedNotes = this.notes.filter(note => note.id !== noteId);
            this.notes = updatedNotes;
            this.notesUpdated.next([...this.notes]);
        });
    }
}

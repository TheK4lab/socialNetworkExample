import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NoteCreateComponent } from './notes/notes-create/note-create.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'posts', component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'createNote', component: NoteCreateComponent, canActivate: [AuthGuard] },
    { path: 'editNote/:noteId', component: NoteCreateComponent, canActivate: [AuthGuard] },
    { path: 'notes', component: NoteListComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent},
    { path: '', component: LoginComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}

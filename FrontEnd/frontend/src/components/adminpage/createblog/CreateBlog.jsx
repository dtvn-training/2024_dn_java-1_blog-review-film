import React, { useState } from 'react';


const CreateBlog = () => {
    const {title, setTitle} = useState('');
    const {filmName, setFilmName} = useState(''); 
    const {summary, setSummary} = useState('');
    const {thumbnail, setThumbnail} = useState('');
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'
    ]
    const BLOG_FILMS = [
        {
            id: 1,
            name: 'Film 1'
        },
        {
            id: 2,
            name: 'Film 2'
        },
        {
            id: 3,
            name: 'Film 3'
        }
    ]
    return (
        <section className="create-blog">
            <div className="container">
                <h1>Create Blog</h1>
                <p className="form__error-message">
                    This is a error message
                </p>
                form.form <create-blog__form>
                    <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}
                    autoFocus />
                    <select name="filmId" id="filmId" value={filmName} onChange={e => setFilmName(e.target.value)}>
                           {
                                 BLOG_FILMS.map(film => {
                                      return <option key={film.id} value={film.name}>{film.name}</option>
                                 })
                           }
                    </select>
                </create-blog__form>
            </div>
        
        </section>
    );
}
export default CreateBlog;

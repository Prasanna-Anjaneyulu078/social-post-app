import React, { useState, useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Image as ImageIcon, X } from 'lucide-react';
import './index.css';

export default function CreatePost({ onPost }) {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() || imageFile) {
      onPost(content, imageFile);
      setContent('');
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="mb-4 createPostCard">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea"
            />
          </Form.Group>

          {imagePreview && (
            <div className="imagePreviewContainer">
              <img src={imagePreview} alt="Preview" className="imagePreview" />
              <button type="button" className="removeImageBtn" onClick={removeImage}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <label className="photoLabel">
              <ImageIcon size={20} className="me-2" />
              Photo
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
            <Button variant="primary" type="submit" className="postBtn" disabled={!content.trim() && !imagePreview}>
              Post
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

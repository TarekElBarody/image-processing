import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { API_URL } from '../common/config';

export interface Props {
    show: boolean;
    handleClose: Function;
}

const useUploadForm = (url: string) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadForm = async (formData: FormData) => {
        //setIsLoading(true);
        await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            onUploadProgress: (progressEvent) => {
                const progress = (progressEvent.loaded / progressEvent.total) * 50;
                setProgress(progress);
            },
            onDownloadProgress: (progressEvent) => {
                const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
                console.log(progress);
                setProgress(progress);
            }
        });

        await new Promise((resolve) => {
            setTimeout(() => resolve('success'), 500);
        });
        setIsSuccess(true);
        setProgress(0);
    };

    return { uploadForm, isSuccess, progress };
};

const UploadImage: React.FunctionComponent<Props> = (props) => {
    const [isSuccessImage, setIsSuccessImage] = useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File>();
    const { isSuccess, uploadForm, progress } = useUploadForm(API_URL + 'images/upload');

    const handleClose = () => props.handleClose(false);
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update the state
        const fileList = e.target.files;

        if (!fileList) return;

        setSelectedFile(fileList[0]);
    };

    if (isSuccess && isSuccessImage === false) {
        handleClose();
        setIsSuccessImage(true);
    }
    const handleSubmit = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('photo', selectedFile, selectedFile.name);
            console.log(selectedFile);

            // Request made to the backend api
            // Send formData object
            return await uploadForm(formData);
        }
    };

    return (
        <Modal show={props.show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Pick up your photo</Form.Label>
                        <Form.Control type="file" size="lg" onChange={onFileChange} />
                    </Form.Group>
                </Form>
                <ProgressBar now={progress} label={`${progress}%`} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadImage;

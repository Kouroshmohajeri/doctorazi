import React,{useCallback, useContext, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.css';
import { useState } from 'react';
import Image from 'next/legacy/image';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import getHttpOnlyCookies from '@/getCookies';
import decoder from '@/lib/decode';
import { uploadFiles } from '@/lib/actions/uploadClinicalRecords/actions';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';
import { deleteProfileImagesByFolderAndFileName, deleteProfileImagesByName, getProfileImageByFileName, getProfileImagesByUserId } from '@/lib/actions/profileImage/actions';

const Dropzone = (folder,prefix,parent,id,isProfile=false) => {
    const {refresh, setRefresh} = useContext(ClinicalRecordContext);
    const [files, setFiles] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [users, setUsers] = useState({
        id: null,
        type: null
      });
      useEffect(() => {
        const fetchCookies = async () => {
          try {
            const token = await getHttpOnlyCookies();
            if (token && token !== 'undefined' && token !== "") {
              const user = await decoder(token);
              setUsers({ id: user.data.user_id / 8312, type: user.data.user_type });
            }
          } catch (error) {
            console.error('Failed to fetch token:', error);
          }
        };
        fetchCookies();
      }, []);

    // const onDrop = useCallback((acceptedFiles,rejectedFiles) => {
    //     if (acceptedFiles?.length) {
    //         setFiles(prev=>[
    //             ...prev,
    //             ...acceptedFiles.map(file=>
    //                 Object.assign(file,{preview:URL.createObjectURL(file)})
    //             )
    //         ]);
    //     }
    //     if (rejectedFiles?.length) {
    //         console.log(rejectedFiles)
    //         setRejected(prev=>[
    //             ...prev,
    //             ...rejectedFiles
    //         ])
    //     }
    // },[]);
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (acceptedFiles?.length) {
          if (folder.isProfile) {
            if (files.length === 0) {
              // If there are no files uploaded yet, keep only the first accepted file
              const firstAcceptedFile = acceptedFiles.slice(0, 1);
              setFiles(prev => [
                ...prev,
                ...firstAcceptedFile.map(file =>
                  Object.assign(file, { preview: URL.createObjectURL(file) })
                )
              ]);
            }
            // If folder.isProfile is true and there's already an uploaded image, don't add more files
            return;
          }
          setFiles(prev => [
            ...prev,
            ...acceptedFiles.map(file =>
              Object.assign(file, { preview: URL.createObjectURL(file) })
            )
          ]);
        }
        if (rejectedFiles?.length) {
          console.log(rejectedFiles);
          setRejected(prev => [
            ...prev,
            ...rejectedFiles
          ]);
        }
      }, [folder.isProfile, files]);
      
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (folder.isProfile===true) {
          try {
            // Step 1: Get all folders for the user
            const foldersResponse = await getProfileImagesByUserId(users.id);
            const userFolders = foldersResponse.userFolders;
      
            // Step 2: Check if there are any folders available
            if (userFolders.length > 0) {
              // Select the first folder (assuming there's only one)
              const folderName = userFolders[0];
      
              // Step 3: Get all files in the folder
              const recordsResponse = await getProfileImageByFileName(folderName);
              const files = recordsResponse.files;
      
              // Check if there are any files in the folder
              if (files.length > 0) {
                // If files exist, delete them
                files.forEach(async (fileName) => {
                  await deleteProfileImagesByFolderAndFileName(folderName, fileName);
                });
                // Now delete the folder itself
                await deleteProfileImagesByName(folderName);
              }
            }
          } catch (error) {
            console.error('Error handling submit:', error.message);
          }
        }
        if (!files?.length) {
          return null;
        }
        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));
        formData.append('upload_preset', 'clinicalRecord');
        try {
            if (folder.parent===2) {
                await uploadFiles(folder.id,folder.folder,folder.prefix,formData);
                alert("Uploaded successfully!");
            }
            else{
                await uploadFiles(users.id,folder.folder.folder,folder.folder.prefix,formData);
                alert("Uploaded successfully!");
            }
            setFiles([]);
            setRefresh(!refresh)
        } catch (error) {
            alert("Something went wrong!",error)
          console.error('Error uploading files:', error);
        }
      };
    const removeFile = (filename) => {
        setFiles(files=>files.filter(file => file.name !== filename));
    }
    const removeRejected = name =>{
        setRejected(files=>files.filter(({file})=>file.name !== name));
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop,
        accept:{
            'image/*':[],
            'application/pdf':[]
        },
        maxSize: 1024 * 4000
    });
    return (
        <form onSubmit={handleSubmit}>
            <div {...getRootProps({
                className:styles.dropzone
            })}>
                <input {...getInputProps()}/>
                {isDragActive?(<p>Drop the files here...</p>):(<p>Drag and drop the files here, or click to select the files</p>)}
            </div>
            {files?.length?
            <div className={styles.accepted}>
                <h3>Uploaded</h3>
                <ul className={styles.listParent}>
                    {files.map(file=>(
                        <li key={file.name} className={styles.listItem}>
                            <button type='button' className={styles.btnRemove} onClick={()=>removeFile(file.name)}>
                                <CloseSharpIcon/>
                            </button>
                            <Image src={file.preview} alt={file.name} width={100} height={100} onLoad={()=>{URL.revokeObjectURL(file.preview)}}/>
                            <p>
                                {file.name}
                            </p>
                        </li>
                    ))}
                </ul>
                <button onClick={handleSubmit} className={`btn btn-outline-primary ${styles.upload}`}>Add</button>
            </div>:null
            }
            {rejected?.length?
                <div className={styles.rejectedContainer}>
                    <hr/>
                    <h3>Rejected Files</h3>
                    <ul className={styles.errorParent}>
                        {rejected.map(({file,errors})=>(
                            <li key={file.name} className={styles.errorItems}>
                                <div>
                                    <p>{file.name}</p>
                                    <ul className={styles.errorList}>
                                        {errors.map(err=>(
                                            <li key={err.code}>{err.message}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="button" onClick={()=>{removeRejected(file.name)}} className={styles.btnRemoveRejected}>
                                    <CloseSharpIcon/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            :null}
        </form>
    )
}

export default Dropzone

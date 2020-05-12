import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { setRoster } from '../actions/roster'
import { createLineup } from '../actions/lineup'
// import Message from './Message'
import axios from 'axios'
// import Progress from './Progress'
import { Spinner } from 'react-bootstrap'

const FileUpload = () => {
  const [file, setFile] = useState('')
  const [fileloading1, setFileLoading1] = useState(false)
  const [fileloading2, setFileLoading2] = useState(false)
  const [fileloading3, setFileLoading3] = useState(false)
  const [filename, setFilename] = useState('Choose File')
  const [uploadedFile, setUploadedFile] = useState({})
  // const [message, setMessage] = useState('')
  // const [uploadPercentage, setUploadPercentage] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState('')

  const onChange = (e) => {
    setFile(e.target.files[0])
    setFilename(e.target.files[0].name)
    setFileLoading1(true)
    setTimeout(() => setFileLoading2(true), 100)
    setTimeout(() => setFileLoading3(true), 200)
    setIsSubmitted(true)
    setTimeout(() => {
      setFileLoading1(false)
      setFileLoading2(false)
      setFileLoading3(false)
      setIsSubmitted(false)
    }, 4000)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // setUploadPercentage(
          //   parseInt(
          //     Math.round((progressEvent.loaded * 99) / progressEvent.total)
          //   )
          // )

          // Clear percentage
          setTimeout(() => {
            setFileLoading1(false)
            setFileLoading2(false)
            setFileLoading3(false)
          }, 5000)
        },
      })

      const { fileName, filePath } = res.data
      setUploadedFile({ fileName, filePath })
      const csvPath = '/uploads/' + fileName
      // setMessage('File Uploaded')

      setRoster(csvPath)
      createLineup()
    } catch (err) {
      if (err.response.status === 500) {
        // setMessage('There was a problem with the server')
      } else {
      }
    }
  }

  return (
    <Fragment>
      {/* {message ? <Message msg={message} /> : null} */}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        {/* <Progress percentage={uploadPercentage} /> */}

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
          disabled={isSubmitted}
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
      {fileloading1 && (
        <div className='spinner-container'>
          <Spinner className='spinner' animation='grow' variant='primary' />
          {fileloading2 && (
            <Spinner className='spinner' animation='grow' variant='primary' />
          )}
          {fileloading3 && (
            <Spinner className='spinner' animation='grow' variant='primary' />
          )}
        </div>
      )}
    </Fragment>
  )
}

const MapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(MapStateToProps, {
  setRoster,
  createLineup,
})(FileUpload)

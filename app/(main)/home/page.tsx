"use client"
import React, { useEffect, useState } from 'react'
import { FiUpload } from "react-icons/fi"
import CardComponent from '@/components/Card'

import { useAtom } from 'jotai'
import { ImageFiles } from '@/components/Jotai/atoms'

const Homepage = () => {
  const [files, setFiles] = useAtom<any>(ImageFiles);

  // Handling file selection
  const handleFiles = (selectedFiles: any) => {
    setFiles((prevFiles: any) => [...prevFiles, ...Array.from(selectedFiles)]);
  }

  // Handling file drop
  const handleDrop = (e: any) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  // Preventing default behavior for drag over events
  const handleDragOver = (e: any) => {
    e.preventDefault();
  }

  return (
    <>
      {files.length > 0 ?
        <div className='flex flex-col items-center w-full h-screen'>
          <div className='w-full px-4 py-2'>
            {files.map((file: any, index: any) => (
              <CardComponent key={index} file={file} />
            ))}
          </div>
        </div>
        :
        <div className='flex flex-col justify-center items-center w-full h-screen'>
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="bg-white text-gray-500 font-semibold text-base rounded max-w-md flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] w-80 h-80"
          >
            <FiUpload size={50} />
            Upload file
            <input type="file" id='uploadFile1' multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG, SVG, WEBP, and GIF are allowed.</p>
          </label>
        </div >
      }
    </>
  )
}

export default Homepage;

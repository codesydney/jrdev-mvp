import { useState } from 'react'

const Confirmation = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-black rounded mr-2" onClick={onConfirm}>
            Confirm
          </button>
          <button className="px-4 py-2 bg-blue-500 text-black rounded" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Confirmation

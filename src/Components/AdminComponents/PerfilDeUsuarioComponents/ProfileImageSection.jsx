"use client"

import { FiCamera, FiCheck, FiUpload } from "react-icons/fi"

/**
 * Componente para la sección de imagen de perfil
 */
const ProfileImageSection = ({
  userData,
  editMode,
  fileInputRef,
  handleImageClick,
  handleImageChange,
  toggleEditMode,
}) => {
  return (
    <div className="col-md-3">
      <div className="profile-image-container text-center">
        <div className={`profile-image-wrapper ${editMode.profileImage ? "editable" : ""}`} onClick={handleImageClick}>
          <img
            src={userData.profileImage || "/placeholder.svg"}
            alt="Foto de perfil"
            className="profile-image img-fluid rounded-circle"
          />
          {editMode.profileImage && (
            <div className="image-overlay">
              <FiCamera size={24} />
              <div className="mt-2 small">Click para cambiar</div>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handleImageChange} />
        <button
          type="button"
          className={`btn btn-sm mt-2 ${editMode.profileImage ? "btn-success" : "btn-outline-primary"}`}
          onClick={() => toggleEditMode("profileImage")}
        >
          {editMode.profileImage ? (
            <>
              <FiCheck className="me-1" /> Listo
            </>
          ) : (
            <>
              <FiUpload className="me-1" /> Cambiar foto
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProfileImageSection


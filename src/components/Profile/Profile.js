
import React, { useState } from 'react';
import './Profile.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({
    nombre: 'Maria',
    apellidoPaterno: 'Gonzales',
    apellidoMaterno: 'Perez',
    departamento: 'La Paz',
    ciudad: 'La Paz',
    telefono: '77712345',
    correo: 'maria.gonzales@example.com',
    profilePicture: 'https://via.placeholder.com/150'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    // Here you would typically call an API to save the user data
    console.log('Saving user data:', editedUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-sidebar">
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <h2>{`${user.nombre} ${user.apellidoPaterno}`}</h2>
          <p>{user.correo}</p>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <h1>Perfil de Usuario</h1>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <FaUser className="icon" />
              <div>
                <span>Nombre</span>
                {isEditing ? <input type="text" name="nombre" value={editedUser.nombre} onChange={handleInputChange} /> : <p>{user.nombre}</p>}
              </div>
            </div>
            <div className="detail-item">
              <FaUser className="icon" />
              <div>
                <span>Apellido Paterno</span>
                {isEditing ? <input type="text" name="apellidoPaterno" value={editedUser.apellidoPaterno} onChange={handleInputChange} /> : <p>{user.apellidoPaterno}</p>}
              </div>
            </div>
            <div className="detail-item">
              <FaUser className="icon" />
              <div>
                <span>Apellido Materno</span>
                {isEditing ? <input type="text" name="apellidoMaterno" value={editedUser.apellidoMaterno} onChange={handleInputChange} /> : <p>{user.apellidoMaterno}</p>}
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="icon" />
              <div>
                <span>Correo Electrónico</span>
                <p>{user.correo}</p> {/* Email is not editable */}
              </div>
            </div>
            <div className="detail-item">
              <FaPhone className="icon" />
              <div>
                <span>Teléfono</span>
                {isEditing ? <input type="text" name="telefono" value={editedUser.telefono} onChange={handleInputChange} /> : <p>{user.telefono}</p>}
              </div>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <span>Departamento</span>
                {isEditing ? <input type="text" name="departamento" value={editedUser.departamento} onChange={handleInputChange} /> : <p>{user.departamento}</p>}
              </div>
            </div>
            <div className="detail-item">
              <FaCity className="icon" />
              <div>
                <span>Ciudad</span>
                {isEditing ? <input type="text" name="ciudad" value={editedUser.ciudad} onChange={handleInputChange} /> : <p>{user.ciudad}</p>}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <div>
                <button onClick={handleSave} className="edit-btn">Guardar Cambios</button>
                <button onClick={handleCancel} className="edit-btn" style={{marginLeft: '10px', backgroundColor: '#7f8c8d'}}>Cancelar</button>
              </div>
            ) : (
              <button onClick={handleEdit} className="edit-btn">Editar Perfil</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

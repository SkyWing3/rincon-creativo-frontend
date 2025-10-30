import React, { useContext, useEffect, useMemo, useState } from 'react';
import './Checkout.css';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const Checkout = ({ cartItems = [] }) => {
    const { user, token } = useContext(AuthContext);
    const [razonSocial, setRazonSocial] = useState('');
    const [nit, setNit] = useState('');
    const [profile, setProfile] = useState(user || null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchProfile = async () => {
            setIsLoadingProfile(true);
            setProfileError(null);
            try {
                const response = await authService.getProfile(token);
                const payload = response?.data || response;
                if (payload?.data) {
                    setProfile(payload.data);
                } else {
                    setProfile(payload);
                }
            } catch (error) {
                console.error('No se pudo obtener el perfil del usuario', error);
                setProfileError('No se pudieron cargar los datos del perfil.');
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const hasItems = cartItems.length > 0;
    const cartTotal = useMemo(() => {
        if (!hasItems) {
            return 0;
        }
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            return total + price * (item.quantity || 0);
        }, 0);
    }, [cartItems, hasItems]);

    if (!token) {
        return (
            <div className="checkout-container">
                <h2>Finalizar Compra</h2>
                <p>Debes iniciar sesión para finalizar la compra.</p>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            <div className="checkout-content">
                <div className="user-data">
                    <h3>Datos de la Cuenta</h3>
                    {isLoadingProfile && <p className="checkout-status">Cargando datos del perfil...</p>}
                    {profileError && !isLoadingProfile && (
                        <p className="checkout-error">{profileError}</p>
                    )}
                    {!isLoadingProfile && !profileError && profile && (
                        <>
                            <p>
                                <strong>Nombre:</strong> {profile.first_name || 'N/D'}
                            </p>
                            <p>
                                <strong>Apellido paterno:</strong> {profile.f_last_name || 'N/D'}
                            </p>
                            <p>
                                <strong>Apellido materno:</strong> {profile.s_last_name || 'N/D'}
                            </p>
                            <p>
                                <strong>Correo electrónico:</strong> {profile.email || 'N/D'}
                            </p>
                            <p>
                                <strong>Teléfono:</strong> {profile.phone || 'N/D'}
                            </p>
                            <p>
                                <strong>Departamento:</strong> {profile.departamento || 'N/D'}
                            </p>
                            <p>
                                <strong>Ciudad:</strong> {profile.city || 'N/D'}
                            </p>
                            <p>
                                <strong>Dirección:</strong> {profile.address || 'N/D'}
                            </p>
                        </>
                    )}
                    {!isLoadingProfile && !profileError && !profile && (
                        <p className="checkout-status">
                            No se encontraron datos del perfil. Intenta nuevamente más tarde.
                        </p>
                    )}
                </div>

                <div className="billing-data">
                    <h3>Datos de Facturación</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="razonSocial">Razón Social</label>
                            <input
                                type="text"
                                id="razonSocial"
                                value={razonSocial}
                                onChange={(event) => setRazonSocial(event.target.value)}
                                placeholder="Nombre o razón social"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nit">NIT o Carnet de Identidad</label>
                            <input
                                type="text"
                                id="nit"
                                value={nit}
                                onChange={(event) => setNit(event.target.value)}
                                placeholder="Ingresa tu NIT o CI"
                            />
                        </div>
                    </form>
                </div>

                <div className="cart-summary">
                    <h3>Resumen del Carrito</h3>
                    {!hasItems && (
                        <p className="checkout-status">
                            Aún no tienes productos en tu carrito. Agrega artículos en el catálogo para continuar.
                        </p>
                    )}
                    {hasItems &&
                        cartItems.map((item) => {
                            const subtotal = Number(item.price || 0) * (item.quantity || 0);
                            return (
                                <div key={item.id} className="cart-item-summary">
                                    <span>
                                        {item.name} (x{item.quantity})
                                    </span>
                                    <span>Bs {subtotal.toFixed(2)}</span>
                                </div>
                            );
                        })}
                    {hasItems && (
                        <div className="cart-total-summary">
                            <strong>Total:</strong>
                            <span>Bs {cartTotal.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="payment-method">
                        <h4>Método de Pago</h4>
                        <div className="binance-pay">
                            <img
                                src="https://img.icons8.com/fluency/48/binance.png"
                                alt="Binance Pay"
                            />
                            <span>Binance Pay</span>
                        </div>
                    </div>
                    <button className="place-order-btn" disabled={!hasItems}>
                        {hasItems ? 'Realizar Pedido' : 'Agrega productos para continuar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

import React from 'react';
import '../styles/Footer.css';

export const Footer = () => {
    return (
        <>
            <footer>
                <div className='about'>
                    <label> Acerca de nosotros </label>
                    <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis consequatur pariatur ea? Pariatur. </p>
                </div>
                <div className='contacto'>
                    <label> Contacto </label>
                    <div className="contact-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                            <path d="M6.49946 7.53225C7.30117 7.53225 7.95108 6.88234 7.95108 6.08064C7.95108 5.27894 7.30117 4.62903 6.49946 4.62903C5.69776 4.62903 5.04785 5.27894 5.04785 6.08064C5.04785 6.88234 5.69776 7.53225 6.49946 7.53225Z" stroke="#76B8C3" strokeMiterlimit="10"/>
                            <path d="M11.5802 6.25847C11.5677 3.35403 9.3058 1 6.49959 1C3.69338 1 1.41895 3.35403 1.41895 6.25847C1.41895 10.0172 6.49112 16 6.49112 16C6.49112 16 11.5969 10.0172 11.5802 6.25847Z" stroke="#76B8C3" strokeMiterlimit="10"/>
                        </svg>
                        <span>Lugar</span>
                    </div>
                    <div className="contact-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 17 11" fill="none">
                            <path d="M1 1.02417H16V9.97578H1V1.02417Z" stroke="#76B8C3" strokeMiterlimit="10"/>
                            <path d="M1 1.02417L8.5 5.86288L16 1.02417" stroke="#76B8C3" strokeMiterlimit="10"/>
                        </svg>
                        <span>mailsoporte@dominio.com</span>
                    </div>
                    <div className="contact-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M15.9995 12.2304V14.4885C16.0004 14.6981 15.9574 14.9056 15.8732 15.0977C15.7891 15.2898 15.6657 15.4622 15.5109 15.6039C15.3561 15.7456 15.1734 15.8535 14.9744 15.9207C14.7754 15.9878 14.5646 16.0128 14.3554 15.9939C12.0346 15.7422 9.80532 14.9508 7.84668 13.6831C6.02441 12.5274 4.47945 10.9855 3.3215 9.16689C2.0469 7.20324 1.25368 4.96756 1.00612 2.64096C0.987275 2.43282 1.01206 2.22303 1.0789 2.02497C1.14574 1.82691 1.25317 1.6449 1.39436 1.49055C1.53554 1.33619 1.70738 1.21287 1.89893 1.12843C2.09049 1.04398 2.29756 1.00027 2.50697 1.00007H4.76956C5.13558 0.996478 5.49041 1.12583 5.76793 1.36403C6.04546 1.60222 6.22672 1.93301 6.27795 2.29472C6.37345 3.01736 6.55055 3.72691 6.80589 4.40981C6.90736 4.67922 6.92932 4.97202 6.86917 5.2535C6.80902 5.53498 6.66928 5.79336 6.4665 5.99801L5.50867 6.95394C6.58231 8.83837 8.14568 10.3986 10.0338 11.4702L10.9917 10.5142C11.1967 10.3118 11.4556 10.1724 11.7377 10.1123C12.0197 10.0523 12.3131 10.0742 12.583 10.1755C13.2673 10.4303 13.9782 10.6071 14.7023 10.7024C15.0687 10.754 15.4023 10.9358 15.6405 11.214C15.8787 11.4922 16.0072 11.8479 16.0005 12.2149L15.9995 12.2304Z" stroke="#76B8C3" strokeMiterlimit="10"/>
                        </svg>
                        <span>(54) 011 4311 - 3006

</span>
                    </div>
                </div>
            </footer>
            <div className='derechosCopal'>
                <p>© 2023 COPAL. Todos los derechos reservados. Realizado por UTN - Aceleradora Tribu 1 Squad 1</p>
            </div>
        </>
    );
}

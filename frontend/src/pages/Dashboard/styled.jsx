import styled from 'styled-components';

export const Button = styled.button`
    flex: 1;
    background-color: ${({ isActive }) => (isActive ? 'var(--dark-purple)' : 'initial')};
    border: none;
    color: ${({ isActive }) => (isActive ? '#fff' : 'initial')}
`;

export default Button;

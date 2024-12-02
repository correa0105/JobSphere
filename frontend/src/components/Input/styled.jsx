import styled from 'styled-components';

export const LabelContainer = styled.label`

    display: flex;
    cursor: pointer;

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 11rem;
        font-size: 1.2rem;
        background-color: var(--english-violet);
        color: #fff;
    }

    input {
        padding-left: .5rem;
        padding-right: .5rem;
        width: 100%;
        height: 33px;
        border: none;
        background-color: #eee;
        outline: none;
        font-size: 1rem;
    }

    @media screen and (min-width: 728px) {
        span {
            font-size: 1.3rem;
            min-width: 11rem;
        }
        
        input {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
`;

export default LabelContainer;

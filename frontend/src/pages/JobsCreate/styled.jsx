import styled from 'styled-components';

const InputSelect = styled.label`
    display: flex;
    margin-top: 20px;
    cursor: pointer;

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 11rem;
        font-size: 1.3rem;
        background-color: var(--english-violet);
        color: #fff;
    }

    select {
        padding: 6px;
        height: 33px;
        border: none;
        flex-grow: 1;
        background-color: #eee;
        outline: none;
        font-size: 1.3rem;
    }

    @media screen and (min-width: 728px) {
        span {
            font-size: 1.3rem;
            min-width: 11rem;
        }
    }
`;

export default InputSelect;

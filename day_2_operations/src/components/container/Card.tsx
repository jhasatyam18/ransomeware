import React, { ReactNode } from 'react';
import { Card } from 'reactstrap';
import styled from 'styled-components';
// Define props to accept children
interface CardContainerProps {
    children: ReactNode;
}
const CardContainer: React.FC<CardContainerProps> = ({ children }) => (
    <>
        <StyledCard>{children}</StyledCard>
    </>
);
// `;

const StyledCard = styled(Card)`
    height: auto; /* Ensures card height adjusts to content */
    overflow: hidden; /* Prevent content overflow */
    border-radius: 5px;
    align-items: center;
    color: #fff;
    display: flex;
    justify-content: center;
    background-color: #32394e;
    padding: 1rem;
    margin: 1rem;
    overflow-wrap: break-word;
`;
export default CardContainer;

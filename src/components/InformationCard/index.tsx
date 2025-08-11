import React from "react";

import { Container, IconBox, TextWrapper, Title, Line } from "./styles";

export interface InformationCardProps {
    icon?: React.ElementType;
    title: string;
    information: string | string[];
}

export function InformationCard({ icon: Icon, title, information }: InformationCardProps) {
    
    const infoText = Array.isArray(information) ? information.join("\n") : information;
    
    return (
        <Container>
            {Icon && (
                <IconBox>
                    <Icon aria-hiden />   {/* svg herda cor/tamanho do CSS do IconBox */}
                </IconBox>
            )}

            <TextWrapper>
                <Title>{title}</Title>
                <Line>{infoText}</Line>
            </TextWrapper>
        </Container>
    )
}
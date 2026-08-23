import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from '@react-email/components';

interface OtpTemplateProps {
  code: string;
  name?: string;
}

export const OtpTemplate: React.FC<Readonly<OtpTemplateProps>> = ({
  code,
  name = 'User',
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', padding: '20px' }}>
      <Container style={{ backgroundColor: '#ffffff', border: '1px solid #eaeaea', padding: '40px', borderRadius: '5px' }}>
        <Heading style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 20px 0' }}>
          Verify your email address
        </Heading>
        <Text style={{ fontSize: '16px', color: '#333' }}>
          Hi {name},
        </Text>
        <Text style={{ fontSize: '16px', color: '#333' }}>
          Please use the following verification code to complete your registration. This code is valid for 10 minutes.
        </Text>
        <Section style={{ background: '#f4f4f4', padding: '20px', textAlign: 'center', borderRadius: '5px', margin: '30px 0' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', letterSpacing: '5px' }}>
            {code}
          </Text>
        </Section>
        <Text style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
          If you did not request this, please ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

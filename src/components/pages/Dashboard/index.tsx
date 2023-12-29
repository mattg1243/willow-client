import { useState } from 'react';
import {
  VStack,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import ClientTable from './../../ClientTable';
import styles from './Dashboard.module.css';

interface IProps {
  archiveMode: boolean;
}

export default function Dashboard(props: IProps) {
  const { archiveMode } = props;
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <VStack className={styles["container"]}>
        <ClientTable addClientShown={setIsShown} archiveMode={archiveMode} />

        <Modal motionPreset="slideInBottom" onClose={() => { setIsShown(false) }} isOpen={isShown}>
          <ModalOverlay />
          <ModalContent pb={5}>
            <ModalHeader>New Client</ModalHeader>
            <ModalCloseButton />
            <ModalBody className={styles["modal-body"]}>

            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </>
  );
}

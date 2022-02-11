import React, { useEffect, useState } from 'react'

import { Button, Input, Modal, Text } from '@nextui-org/react'
import { RiLink } from 'react-icons/ri'


type LinkModalProps = {
  visible: boolean,
  onClose: (url?: string) => void,
  url?: string
}

const LinkModal = ({ visible, onClose, url }: LinkModalProps) => {
  const [link, setLink] = useState<string>("")

  const onApply = () => onClose(link)

  useEffect(() => { url ? setLink(url) : setLink("") }, [visible, url])

  return (
    <Modal blur closeButton open={visible} onClose={onClose} >
      <Modal.Header>
        <Text id="modal-title" b size={18}>
          Enter URL:
        </Text>
      </Modal.Header>

      <Modal.Body>
        <Input
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="https://google.com"
          contentLeft={<RiLink />}
          value={link}
          onInput={(e) => setLink((e.target as HTMLInputElement).value.trim())}
          onKeyPress={(e) => e.key === 'Enter' && onApply()}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button auto flat color="error" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button auto onClick={onApply}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LinkModal
import React from 'react';

import { useEditor, EditorContent, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

import './Tiptap.scss'
import Menubar from './Menubar'
import { SearchNReplace, CustomPurposeExtension } from './extensions'
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { CodeBlockLowLight } from './extensions/CodeBlockLowLight';
import { Text } from '@nextui-org/react';
import { useSetRecoilState } from 'recoil';
import { linkModalState } from '../../Store';

interface TiptapProps {
  onUpdate: Function
  content: Content
}

const Tiptap = ({ onUpdate, content }: TiptapProps) => {
  const setGlobalLinkModalVisibleState = useSetRecoilState(linkModalState)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, }),
      Placeholder.configure({ placeholder: 'Type here...' }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'], }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
      }),
      SearchNReplace,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowLight,

      CustomPurposeExtension.configure({ onLinkShortcutEntered: () => setGlobalLinkModalVisibleState(true) }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML(), editor.getText())
    },
    onCreate: () => {
      const editorArea = document.querySelector('.editor-area');

      if (!editorArea) return

      (editorArea as HTMLDivElement).addEventListener('click', () => editor?.commands.focus());

    },
    onDestroy: () => {
      const editorArea = document.querySelector('.editor-area');

      if (!editorArea) return

      (editorArea as HTMLDivElement).removeEventListener('click', () => editor?.commands.focus());
    },
    autofocus: false,
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  })

  return (
    <>
      {editor && <Menubar editor={editor} />}

      <EditorContent className='editor-content' editor={editor} />

      <Text className='word-and-character-count-section flex'>
        <span>
          {editor?.storage.characterCount.characters()} Characters
        </span>
        {'&'}
        <span>
          {editor?.storage.characterCount.words()} Words
        </span>
      </Text>
    </>
  )
}

export default Tiptap

// EditeurDeTexte.jsx
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Import des icônes Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faStrikethrough,
  faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify,
  faListUl, faListOl, faIndent, faOutdent, faUndo, faRedo,
  faEraser, faSave, faHighlighter, faCode, faSuperscript,
  faSubscript, faHeading, faFont, faLink, faUnlink, faImage,
  faPalette, faTextHeight, faTable
} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  background-color: #e0f7fa; /* Fond bleu clair */
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #0077ff;
  font-size: 2.5em;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #e6e6e6;
  }
  &:focus {
    outline: none;
    background-color: #e6e6e6;
  }
`;

const Dropdown = styled.select`
  margin: 5px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  margin: 5px;
`;

const ColorSwatch = styled.button`
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => props.color};
  &:focus, &:hover {
    outline: 2px solid #0077ff;
  }
`;

const EditorContainer = styled.div`
  width: 816px; /* Largeur d'une page Word en pixels */
  min-height: 1056px; /* Hauteur d'une page Word en pixels */
  margin: 0 auto;
  padding: 50px 70px;
  background-color: white;
  border: 1px solid #d4d4d4;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  resize: both;
  overflow: auto;
  font-family: 'Calibri', sans-serif;
  border-radius: 8px;
  position: relative;
`;

const Editor = styled.div`
  min-height: 800px;
  outline: none;

  img {
    max-width: 100%;
    height: auto;
  }

  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
`;

const SaveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #0077ff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 1em;
  &:hover {
    background-color: #005bbb;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.primary ? '#0077ff' : '#ccc')};
  color: ${(props) => (props.primary ? 'white' : 'black')};
  &:hover {
    background-color: ${(props) => (props.primary ? '#005bbb' : '#bbb')};
  }
`;

const EditeurDeTexte = ({ setVlogDescription }) => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSave = () => {
    const content = editorRef.current.innerHTML;
    if (setVlogDescription) {
      setVlogDescription(content);
    }
    navigate(-1); // Retourne à la page précédente
  };

  const insertLink = () => {
    setShowLinkModal(true);
  };

  const confirmLink = () => {
    executeCommand('createLink', linkUrl);
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const insertImage = () => {
    setShowImageModal(true);
  };

  const confirmImage = () => {
    executeCommand('insertImage', imageUrl);
    setShowImageModal(false);
    setImageUrl('');
  };

  return (
    <Container>
      <Title>Description du Vlog</Title>
      <Toolbar>
        {/* Ligne 1 de la barre d'outils */}
        <Button onClick={() => executeCommand('undo')} title="Annuler">
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button onClick={() => executeCommand('redo')} title="Rétablir">
          <FontAwesomeIcon icon={faRedo} />
        </Button>
        <Button onClick={() => executeCommand('bold')} title="Gras">
          <FontAwesomeIcon icon={faBold} />
        </Button>
        <Button onClick={() => executeCommand('italic')} title="Italique">
          <FontAwesomeIcon icon={faItalic} />
        </Button>
        <Button onClick={() => executeCommand('underline')} title="Souligné">
          <FontAwesomeIcon icon={faUnderline} />
        </Button>
        <Button onClick={() => executeCommand('strikeThrough')} title="Barré">
          <FontAwesomeIcon icon={faStrikethrough} />
        </Button>
        <Button onClick={() => executeCommand('subscript')} title="Indice">
          <FontAwesomeIcon icon={faSubscript} />
        </Button>
        <Button onClick={() => executeCommand('superscript')} title="Exposant">
          <FontAwesomeIcon icon={faSuperscript} />
        </Button>

        {/* Ligne 2 de la barre d'outils */}
        <Button onClick={() => executeCommand('justifyLeft')} title="Aligner à gauche">
          <FontAwesomeIcon icon={faAlignLeft} />
        </Button>
        <Button onClick={() => executeCommand('justifyCenter')} title="Centrer">
          <FontAwesomeIcon icon={faAlignCenter} />
        </Button>
        <Button onClick={() => executeCommand('justifyRight')} title="Aligner à droite">
          <FontAwesomeIcon icon={faAlignRight} />
        </Button>
        <Button onClick={() => executeCommand('justifyFull')} title="Justifier">
          <FontAwesomeIcon icon={faAlignJustify} />
        </Button>

        {/* Ligne 3 de la barre d'outils */}
        <Button onClick={() => executeCommand('insertUnorderedList')} title="Liste à puces">
          <FontAwesomeIcon icon={faListUl} />
        </Button>
        <Button onClick={() => executeCommand('insertOrderedList')} title="Liste numérotée">
          <FontAwesomeIcon icon={faListOl} />
        </Button>
        <Button onClick={() => executeCommand('outdent')} title="Diminuer le retrait">
          <FontAwesomeIcon icon={faOutdent} />
        </Button>
        <Button onClick={() => executeCommand('indent')} title="Augmenter le retrait">
          <FontAwesomeIcon icon={faIndent} />
        </Button>

        {/* Ligne 4 de la barre d'outils */}
        <Button onClick={insertLink} title="Insérer un lien">
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <Button onClick={() => executeCommand('unlink')} title="Supprimer le lien">
          <FontAwesomeIcon icon={faUnlink} />
        </Button>
        <Button onClick={insertImage} title="Insérer une image">
          <FontAwesomeIcon icon={faImage} />
        </Button>
        <Button onClick={() => executeCommand('removeFormat')} title="Effacer la mise en forme">
          <FontAwesomeIcon icon={faEraser} />
        </Button>

        {/* Ligne 5 de la barre d'outils */}
        <Dropdown onChange={(e) => executeCommand('formatBlock', e.target.value)} title="Titres">
          <option value="P">Paragraphe</option>
          <option value="H1">Titre 1</option>
          <option value="H2">Titre 2</option>
          <option value="H3">Titre 3</option>
          <option value="H4">Titre 4</option>
          <option value="H5">Titre 5</option>
          <option value="H6">Titre 6</option>
        </Dropdown>
        <Dropdown onChange={(e) => executeCommand('fontSize', e.target.value)} title="Taille du texte">
          <option value="3">Taille normale</option>
          <option value="1">Très petit</option>
          <option value="2">Petit</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Maximal</option>
        </Dropdown>

        {/* Palette de couleurs */}
        <ColorPalette>
          <Button title="Couleur du texte">
            <FontAwesomeIcon icon={faFont} />
          </Button>
          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              onClick={() => executeCommand('foreColor', color)}
              title={`Couleur ${color}`}
            />
          ))}
        </ColorPalette>

        <ColorPalette>
          <Button title="Couleur de surlignage">
            <FontAwesomeIcon icon={faHighlighter} />
          </Button>
          {['#FFFFFF', '#FFFF00', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF'].map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              onClick={() => executeCommand('hiliteColor', color)}
              title={`Surlignage ${color}`}
            />
          ))}
        </ColorPalette>

        {/* Option pour insérer un bloc de code */}
        <Button onClick={() => executeCommand('formatBlock', '<pre>')} title="Bloc de code">
          <FontAwesomeIcon icon={faCode} />
        </Button>
      </Toolbar>
      <EditorContainer>
        <Editor contentEditable ref={editorRef} spellCheck={false}>
          {/* L'utilisateur peut saisir ici */}
        </Editor>
        <SaveButton onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} />
          Enregistrer
        </SaveButton>
      </EditorContainer>

      {/* Modal pour l'insertion de liens */}
      <ModalBackground visible={showLinkModal}>
        <Modal>
          <ModalTitle>Insérer un lien</ModalTitle>
          <ModalInput
            type="text"
            placeholder="Entrez l'URL du lien"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <ModalButtons>
            <ModalButton onClick={() => setShowLinkModal(false)}>Annuler</ModalButton>
            <ModalButton primary onClick={confirmLink}>Insérer</ModalButton>
          </ModalButtons>
        </Modal>
      </ModalBackground>

      {/* Modal pour l'insertion d'images */}
      <ModalBackground visible={showImageModal}>
        <Modal>
          <ModalTitle>Insérer une image</ModalTitle>
          <ModalInput
            type="text"
            placeholder="Entrez l'URL de l'image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <ModalButtons>
            <ModalButton onClick={() => setShowImageModal(false)}>Annuler</ModalButton>
            <ModalButton primary onClick={confirmImage}>Insérer</ModalButton>
          </ModalButtons>
        </Modal>
      </ModalBackground>
    </Container>
  );
};

export default EditeurDeTexte;

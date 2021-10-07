import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const ModalTest = ({ muestro, coordenadas, bloque }) => {
  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [datos, setDatos] = useState({
    ds_bloque: "",
    tp_bloque: "",
  });
  const [conjuntoDatos, setConjuntoDatos] = useState([]);

  useEffect(() => {
    bloque && setNombre(bloque.name);
  }, [bloque]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangeDs = (event) => {
    setDatos({
      ...datos,
      ds_bloque: event.target.value,
    });
  };

  const handleChangeTp = (event) => {
    setDatos({
      ...datos,
      tp_bloque: event.target.value,
    });
  };

  const guardoDatosBloque = () => {
    let newDatos = {
      cd_bloque: bloque.key,
      ds_bloque: datos.ds_bloque,
      tp_bloque: datos.tp_bloque,
      vl_eje_x: bloque.x,
      vl_eje_y: bloque.y,
      vl_ancho: bloque.width,
      vl_largo: bloque.height,
    };
    setConjuntoDatos([...conjuntoDatos, newDatos]);
    setShow(false);
  };

  return (
    <>
      {muestro && (
        <Button
          id={nombre}
          style={{
            position: "relative",
            top: coordenadas.y,
            left: coordenadas.x,
            zIndex: "1",
          }}
          variant="primary"
          onClick={handleShow}
        >
          Show
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">
                Recipient:
              </label>
              <input
                type="text"
                class="form-control"
                id="recipient-name"
                onChange={handleChangeTp}
              />
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">
                Message:
              </label>
              <textarea
                class="form-control"
                id="message-text"
                onChange={handleChangeDs}
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={guardoDatosBloque}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalTest;

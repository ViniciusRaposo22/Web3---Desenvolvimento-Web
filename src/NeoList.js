import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Pagination } from 'react-bootstrap';
import './App.css';

const ListaNEO = () => {
  const [dadosNEO, setDadosNEO] = useState([]);
  const [paginacao, setPaginacao] = useState({ paginaAtual: 1, totalPaginas: 1 });

  const buscarDadosNEO = async (pagina = 1, tamanhoPagina = 15) => {
    try {
      const chaveAPI = 'DKcAdiLeBtHElhBPX9ISVbBE4xoJnnQNJlRE023h';
      const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${pagina}&size=${tamanhoPagina}&api_key=${chaveAPI}`;
      const resposta = await axios.get(apiUrl);

      setDadosNEO(resposta.data.near_earth_objects);
      setPaginacao({
        paginaAtual: resposta.data.page.number,
        totalPaginas: resposta.data.page.total_pages,
      });
    } catch (erro) {
      console.error('Erro ao buscar dados do NEO:', erro);
    }
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  const formatarDiametro = (diametro) => {
    return Number(diametro.toFixed(5));
  };

  useEffect(() => {
    buscarDadosNEO();
  }, []);

  const handleChangePagina = (novaPagina) => {
    buscarDadosNEO(novaPagina);
  };

  const handleIrParaPrimeiraPagina = () => {
    buscarDadosNEO(1);
  };

  const renderizarItensPaginacao = () => {
    const paginasVisiveis = 10;
    const paginaInicial = Math.max(1, paginacao.paginaAtual - Math.floor(paginasVisiveis / 2));
    const paginaFinal = Math.min(paginacao.totalPaginas, paginaInicial + paginasVisiveis - 1);

  return (
      <>
        <Pagination.First onClick={handleIrParaPrimeiraPagina} />
        {paginacao.paginaAtual > 1 && (
          <Pagination.Prev onClick={() => handleChangePagina(paginacao.paginaAtual - 1)} />
        )}
        {Array.from({ length: paginaFinal - paginaInicial + 1 }, (_, index) => {
          const pagina = paginaInicial + index;
          return (
            <Pagination.Item
              key={pagina}
              active={pagina === paginacao.paginaAtual}
              onClick={() => handleChangePagina(pagina)}
            >
              {pagina}
            </Pagination.Item>
          );
        })}
        {paginacao.paginaAtual < paginacao.totalPaginas && (
          <Pagination.Next onClick={() => handleChangePagina(paginacao.paginaAtual + 1)} />
        )}
      </>
    );
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Explorador NEO</h1>
      <Row>
        {dadosNEO.map((neo) => (
          <Col key={neo.id} md={4} className="mb-4">
            <Card style={{ backgroundColor: '#dddddd' }}>
              <Card.Body>
                <Card.Title><strong>Nome: </strong>{neo.name}</Card.Title>
                <Card.Text>
                  <strong>Diâmetro Estimado:</strong>{' '}
                  {`${formatarDiametro(neo.estimated_diameter.kilometers.estimated_diameter_min)} km - ${formatarDiametro(neo.estimated_diameter.kilometers.estimated_diameter_max)} km`}
                  <br />
                  <strong>Data da Primeira Observação:</strong> {formatarData(neo.orbital_data.first_observation_date)} <br />
                  <strong>Data da Última Observação:</strong> {formatarData(neo.orbital_data.last_observation_date)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-4 justify-content-center">
        <Pagination>
          {renderizarItensPaginacao()}
        </Pagination>
      </Row>
    </Container>
  );
};

export default ListaNEO;
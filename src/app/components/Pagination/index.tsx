interface PaginationProps{
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

//Componente de paginação
const Pagination = ({currentPage, lastPage, onPageChange}: PaginationProps) => {
    return(
        <div>   
              <button onClick={() => onPageChange(currentPage -1 )}
                  disabled={currentPage===1}>Anterior</button> {` `}
              <button disabled>{currentPage}</button> {` `}
              <button onClick={() => onPageChange(currentPage +1 )}
                   disabled = {currentPage===lastPage}>Próxima</button><br />
                    <span>Página {currentPage} de {lastPage}</span>
        </div>
    );
}
export default Pagination;

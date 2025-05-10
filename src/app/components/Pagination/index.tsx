interface PaginationProps{
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

//Componente de paginação
const Pagination = ({currentPage, lastPage, onPageChange}: PaginationProps) => {
    return(
     <> 
     {/* não apresenta paginação se tiver apenas uma página */}
        {lastPage > 1 && 
        <div className="flex justify-between items-center mt-2">   
             
                    <span className="text-sm">Página {currentPage} de {lastPage}</span>

                    <span className="flex gap-1">
                        {/* Botao pagina anterior */}
                         <button onClick={() => onPageChange(currentPage -1 )}
                         disabled={currentPage===1} className={`button-base ${currentPage > 1 ? 'button-enabled' : 'button-disabled'}`}>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>  
                        
                        {/* pagina anterior */}
                        {currentPage>1 &&(
                            <button onClick={() => onPageChange(currentPage -1)} className={`button-base button-enabled`}>
                                {currentPage - 1}
                            </button>
                        )}
                             {/* pagina atual */}
                         <button disabled className={`button-base button-active`}>{currentPage}</button> 


                             {/* proxima pagina  */}
                                {currentPage +1 <= lastPage &&(
                                  <button onClick={() => onPageChange(currentPage +1)} 
                                  className={`button-base button-enabled`}>
                                  {currentPage + 1}
                                  </button> 
                                )}

                            {/* Botao Proxima página */}
                         <button onClick={() => onPageChange(currentPage +1 )}
                          disabled = {currentPage===lastPage} className={`button-base ${currentPage< lastPage ? 'button-enabled' : 'button-disabled'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
  
                        </button>

                   </span>
        </div>
        }
     </>
    );
}
export default Pagination;

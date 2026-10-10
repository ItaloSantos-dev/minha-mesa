import { HttpErrorResponse } from "@angular/common/http";

export class ExceptionResponse{
    constructor(
        public status:number,
        public menssage:string
    ){}
    static statusForMenssage(status:number):string{
        switch (status) {
            case 400:
                return 'Requisição inválida. Verifique os dados enviados.';
            case 401:
                return 'Sua sessão expirou ou você não está autenticado.';
            case 409:
                return 'Não foi possível concluir a operação devido a um conflito.';
            case 403:
                return 'Você não tem permissão para acessar este recurso.';
            case 404:
                return 'A página ou recurso solicitado não foi encontrado.';
            default:
                return 'Ocorreu um erro inesperado. Tente novamente.';
        }
    }
    static fromHttpError(erro: HttpErrorResponse): ExceptionResponse {
        return new ExceptionResponse(
            erro.status,
            erro.error?.menssage ?? this.statusForMenssage(erro.status)
        );
    }
}




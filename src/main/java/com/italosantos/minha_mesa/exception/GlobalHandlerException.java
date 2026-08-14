package com.italosantos.minha_mesa.exception;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(UserAlreadyIsOwnerException.class)
    public ResponseEntity<ExceptionResponse> handlerUserAlreadyIsOwner(UserAlreadyIsOwnerException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(OwnerAlreadyHaveRestaurantException.class)
    public ResponseEntity<ExceptionResponse> handlerOwnerAlreadyHaveRestaurantException(OwnerAlreadyHaveRestaurantException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(RestaurantNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handlerRestaurantNotFoundException(RestaurantNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionResponse(HttpStatus.NOT_FOUND, exception.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponse> hanlderResourceNotFoundException(ResourceNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionResponse(HttpStatus.NOT_FOUND, exception.getMessage()));
    }

    @ExceptionHandler(NotPermitedException.class)
    public ResponseEntity<ExceptionResponse> hanlderNotPermitedException(NotPermitedException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ExceptionResponse(HttpStatus.FORBIDDEN, exception.getMessage()));
    }

    @ExceptionHandler(AlreadyExistTableWithNumberException.class)
    public ResponseEntity<ExceptionResponse> handlerAlreadyExistTableWithNumberException(AlreadyExistTableWithNumberException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(ThisDateOfReserveIsNotPermitedException.class)
    public ResponseEntity<ExceptionResponse> handlerThisDateOfReserveIsNotPermitedException(ThisDateOfReserveIsNotPermitedException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(UserIsNotOwnerException.class)
    public ResponseEntity<ExceptionResponse> handlerUserIsNotOwnerException(UserIsNotOwnerException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ExceptionResponse(HttpStatus.FORBIDDEN, exception.getMessage()));
    }

    @ExceptionHandler(IllegalParameterException.class)
    public ResponseEntity<ExceptionResponse> handlerIllegalParameterException(IllegalParameterException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionResponse(HttpStatus.BAD_REQUEST, exception.getMessage()));
    }

    @ExceptionHandler(UserAlreadyRegisterException.class)
    public ResponseEntity<ExceptionResponse> handlerUserAlreadyRegisterException(UserAlreadyRegisterException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(CapacityOfTableInvalidException.class)
    public ResponseEntity<ExceptionResponse> hadlerCapacityOfTableInvalidException(CapacityOfTableInvalidException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionResponse(HttpStatus.BAD_REQUEST, exception.getMessage()));
    }

    @ExceptionHandler(DateOfReserveIsInvalidException.class)
    public ResponseEntity<ExceptionResponse> handlerDateOfReserveIsInvalidException(DateOfReserveIsInvalidException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionResponse(HttpStatus.BAD_REQUEST, exception.getMessage()));
    }

    @ExceptionHandler(TimeIsInvalidException.class)
    public ResponseEntity<ExceptionResponse> handlerTimeOfReserveIsInvalidException(TimeIsInvalidException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ExceptionResponse(HttpStatus.BAD_REQUEST, exception.getMessage()));
    }

    @ExceptionHandler(AlreadyExistsScheduleExceptionException.class)
    public ResponseEntity<ExceptionResponse> handlerAlreadyExistsScheduleExceptionException(AlreadyExistsScheduleExceptionException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(RestaurantAlreadyHasDesactiveException.class)
    public ResponseEntity<ExceptionResponse> handlerRestaurantAlreadyHasDesactiveException(RestaurantAlreadyHasDesactiveException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(RequestRateLimitExceededException.class)
    public ResponseEntity<ExceptionResponse> handlerLoginAttemptsExceededException(RequestRateLimitExceededException exception){
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(new ExceptionResponse(HttpStatus.TOO_MANY_REQUESTS, exception.getMessage()));
    }
}

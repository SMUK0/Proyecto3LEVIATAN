<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
    public function render($request, Throwable $exception)
{
    if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
        // Error 404 - Página no encontrada
        return response()->view('errors.404', [], 404);
    }

    if ($exception instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException) {
        // Error 403 - Acceso prohibido
        return response()->view('errors.403', [], 403);
    }

    if ($exception instanceof \Symfony\Component\HttpKernel\Exception\HttpException && $exception->getStatusCode() == 500) {
        // Error 500 - Error interno del servidor
        return response()->view('errors.500', [], 500);
    }

    return parent::render($request, $exception);
}

// public function render($request, Throwable $exception)
// {
//     if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
//         return redirect('/');
//     }

//     return parent::render($request, $exception);
// }

}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthPadres
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Aquí verificas si el usuario está autenticado como padre
        if (!$request->session()->has('padre_logged_in')) {
            return redirect('/loginPadres')->with('error', 'Debes iniciar sesión para acceder a esta página.');
        }

        return $next($request);
    }
}

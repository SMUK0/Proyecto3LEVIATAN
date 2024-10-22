<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\Request;

class RolController extends Controller
{
    public function index()
    {
        // Recupera todos los roles y los retorna como JSON
        $roles = Rol::all();
        return response()->json($roles);
    }
}

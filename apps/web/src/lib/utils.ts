import { NextResponse } from "next/server";

export function successResponse<T>(data: T, message?: string) {
    return NextResponse.json({
        success: true,
        data,
        message,
    });
}

export function errorResponse(error: string, status: number = 400) {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

export function paginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number
) {
    return NextResponse.json({
        success: true,
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    });
}

export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

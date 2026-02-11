import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CommonService } from '../services/common.service';
import { inject } from '@angular/core';

export const loaderInterceptorFn : HttpInterceptorFn = (
  req,
  next
) => {
  const commonService = inject(CommonService);
  commonService.isLoading.set(true);
  return next(req).pipe(finalize(() => commonService.isLoading.set(false)));
};

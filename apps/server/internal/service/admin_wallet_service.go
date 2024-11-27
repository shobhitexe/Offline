package service

import "context"

type AdminWalletService interface {
	GetBalance(ctx context.Context, id string) (float64, error)
}

func (a *adminService) GetBalance(ctx context.Context, id string) (float64, error) {

	bal, err := a.store.GetBalance(ctx, id)

	if err != nil {
		return 0, err
	}

	return bal, err

}
